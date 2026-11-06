/**
 * @file Finds out what became of a transaction from its sender and nonce, which stay true when a node has forgotten its
 * hash: only one transaction can ever spend a nonce.
 */

import {
  Address,
  Client,
  GetTransactionReturnType,
  Hex,
  isAddressEqual,
  numberToHex,
  ReplacementReason,
  ReplacementReturnType,
  TransactionReceipt,
} from 'viem';
import { getBlock, getBlockNumber, getTransaction, getTransactionCount, getTransactionReceipt } from 'viem/actions';

const DEFAULT_MAX_SCANNED_BLOCKS = 1000;
/**
 * How many blocks above the newest one at its first reading a scan looks at. The nonce was spent by then, so only a block one
 * node had and the node asked for the newest one did not can still hold the transaction that spent it. Reading every block
 * since instead outran the reader on a chain of fast blocks: thousands in a row, past any `maxBlocks`.
 */
const NODE_LAG_BLOCKS = 16n;

/**
 * The sender and nonce of a transaction, and the fields it was sent with, which tell a speed-up from another
 * transaction.
 */
export type NonceSlot = {
  /** The sender as the chain knows it: for a relayed transaction the relayer, not the wallet. */
  from: Address;
  /** The nonce of the transaction. */
  nonce: number;
  /** The recipient. Without `to`, `value` and `input` a replacement is never reported as `repriced`. */
  to?: Address | null;
  /** The value, in wei. */
  value?: bigint;
  /** The calldata. */
  input?: Hex;
};

/**
 * What {@link readNonceSlot} found:
 * - `open`: the nonce is free, so the transaction can still land.
 * - `spender_found`: another transaction spent the nonce and its receipt is not readable yet, which on a load-balanced RPC says
 *   nothing: it was mined, in a block one node has. The tracked transaction will not land unless a reorganization brings it
 *   back, so this is no free nonce. Ask again: with its receipt it is `replaced`.
 * - `ours`: the transaction itself spent the nonce. `receipt` is its receipt, when the node has it already.
 * - `replaced`: another transaction spent it, with the same data as viem's `onReplaced` gives.
 * - `spent`: the nonce is spent, so the transaction can never land, and no transaction of this sender could be found for
 *   it: an EIP-7702 authorization in someone else's transaction, a replacement further back than the scan reached, or a
 *   node behind its load balancer. Read it again before believing it.
 */
export type NonceSlotReading =
  | { state: 'open' }
  | { state: 'spender_found'; transaction: GetTransactionReturnType }
  | { state: 'ours'; receipt?: TransactionReceipt }
  | { state: 'replaced'; replacement: ReplacementReturnType }
  | { state: 'spent' };

/**
 * How far {@link readNonceSlot} has read block bodies. Pass the same object to every reading of one transaction: each
 * goes on where the last one stopped, so a node that limits requests still gets it to the end, and a block is read once.
 */
export type NonceSlotScan = {
  /** The newest block read. */
  newest?: bigint;
  /** The oldest block read. */
  oldest?: bigint;
  /** The newest block it reads, fixed by the first reading of a spent nonce. */
  highest?: bigint;
};

/**
 * The error of a tracker when the nonce of its transaction is spent and no transaction could be found for it. The
 * tracked transaction can never land, but money may have moved in the transaction that spent the nonce.
 */
export class NonceSlotSpentError extends Error {
  override name = 'NonceSlotSpentError';

  /**
   * @param hash - The hash of the transaction that can no longer land.
   */
  constructor(hash: Hex) {
    super(`The nonce of transaction ${hash} was spent by a transaction that could not be found.`);
  }
}

/** viem's rule for a replacement, so a reading here and viem's own `onReplaced` always agree. */
function replacementReason(slot: NonceSlot, transaction: GetTransactionReturnType): ReplacementReason {
  const sameRecipient =
    transaction.to && slot.to
      ? isAddressEqual(transaction.to, slot.to)
      : (transaction.to ?? null) === (slot.to ?? null);
  if (sameRecipient && transaction.value === slot.value && transaction.input === slot.input) return 'repriced';
  return transaction.to && isAddressEqual(transaction.from, transaction.to) && transaction.value === 0n
    ? 'cancelled'
    : 'replaced';
}

/** A receipt the node does not have is an answer, an RPC error is not: it must not read as "not mined". */
async function receiptIfAny(client: Client, hash: Hex): Promise<TransactionReceipt | null> {
  try {
    return await getTransactionReceipt(client, { hash });
  } catch (error) {
    if (error instanceof Error && error.name === 'TransactionReceiptNotFoundError') return null;
    throw error;
  }
}

/** The transaction that spent the nonce, or `null` when it could not be found. */
async function findSpender(
  client: Client,
  slot: NonceSlot,
  fromBlock: bigint | undefined,
  maxBlocks: number,
  scan: NonceSlotScan,
): Promise<GetTransactionReturnType | null> {
  // One call where the node has it. Many nodes do not, and an archive-less one refuses old nonces, so a failure only
  // means the scan below runs.
  const request = client.request as unknown as (args: {
    method: string;
    params: unknown[];
  }) => Promise<{ hash: Hex } | null>;
  const direct = await request({
    method: 'eth_getTransactionBySenderAndNonce',
    params: [slot.from, numberToHex(slot.nonce)],
  }).catch(() => null);
  if (direct?.hash) {
    const transaction = await getTransaction(client, { hash: direct.hash }).catch(() => null);
    if (transaction) return transaction;
  }

  // Block bodies, not historical nonces: a pruned node keeps only about the last 128 blocks of state
  const latest = await getBlockNumber(client, { cacheTime: 0 });
  const reach = latest - BigInt(maxBlocks) + 1n;
  const lowest = fromBlock !== undefined && fromBlock > reach ? fromBlock : reach > 0n ? reach : 0n;
  const inBlock = async (blockNumber: bigint) => {
    const block = await getBlock(client, { blockNumber, includeTransactions: true });
    const found = block.transactions.find((t) => isAddressEqual(t.from, slot.from) && t.nonce === slot.nonce);
    return (found as GetTransactionReturnType | undefined) ?? null;
  };

  scan.newest ??= latest;
  scan.oldest ??= latest + 1n;
  scan.highest ??= latest + NODE_LAG_BLOCKS;
  const top = latest < scan.highest ? latest : scan.highest;
  // Each block is marked read only after it was, so an RPC error here makes the next reading go on from this block
  while (scan.newest < top) {
    const found = await inBlock(scan.newest + 1n);
    if (found) return found;
    scan.newest += 1n;
  }
  // From the newest back, because a tracker asks soon after the replacement lands
  while (scan.oldest > lowest) {
    const found = await inBlock(scan.oldest - 1n);
    if (found) return found;
    scan.oldest -= 1n;
  }
  return null;
}

/**
 * Reads what became of a transaction from its sender and nonce. It works when the node no longer returns the hash, which
 * a node does once a replacement reaches its mempool, or when it drops a transaction whose fee fell too low, and it does
 * not depend on seeing the block the replacement landed in. On a chain with nonce lanes a sender and nonce do not
 * identify a transaction, so the reading is always `open` and viem's own detection is left to do the work.
 *
 * RPC calls: `eth_getTransactionCount`, the receipt of `hash`, and, once the nonce is spent,
 * `eth_getTransactionBySenderAndNonce` where the node has it, otherwise up to `maxBlocks` full blocks back from the newest, and
 * 16 above it for nodes that disagree on the newest one.
 *
 * @param client - The viem client of the chain.
 * @param params - The transaction and how far back to look.
 * @param params.hash - The hash of the tracked transaction.
 * @param params.slot - Its sender and nonce.
 * @param params.fromBlock - A block no replacement can be older than, when known.
 * @param params.maxBlocks - The most blocks back from the newest to read. Defaults to 1000.
 * @param params.scan - The progress of earlier readings of this transaction, updated here.
 * @returns What became of the transaction.
 * @throws The RPC error when the node cannot answer. Nothing is known then, so read it again later.
 *
 * @example
 * ```ts
 * const reading = await readNonceSlot(client, { hash, slot: { from, nonce } });
 * if (reading.state === 'replaced') console.log('Replaced by', reading.replacement.transaction.hash);
 * ```
 */
export async function readNonceSlot(
  client: Client,
  params: { hash: Hex; slot: NonceSlot; fromBlock?: bigint; maxBlocks?: number; scan?: NonceSlotScan },
): Promise<NonceSlotReading> {
  const { hash, slot, fromBlock, maxBlocks = DEFAULT_MAX_SCANNED_BLOCKS, scan = {} } = params;

  const lanes = (client.chain as { transactionReplacement?: { getKey?: unknown } } | undefined)?.transactionReplacement;
  if (lanes?.getKey) return { state: 'open' };

  const used = await getTransactionCount(client, { address: slot.from, blockTag: 'latest' });
  if (used <= slot.nonce) return { state: 'open' };

  const own = await receiptIfAny(client, hash);
  if (own) return { state: 'ours', receipt: own };

  const transaction = await findSpender(client, slot, fromBlock, maxBlocks, scan);
  if (!transaction) return { state: 'spent' };
  if (transaction.hash.toLowerCase() === hash.toLowerCase()) return { state: 'ours' };

  // On a load-balanced RPC the block and the receipt come from different nodes, so no receipt yet says nothing
  const transactionReceipt = await receiptIfAny(client, transaction.hash);
  if (!transactionReceipt) return { state: 'spender_found', transaction };

  return {
    state: 'replaced',
    replacement: {
      reason: replacementReason(slot, transaction),
      replacedTransaction: { ...slot, hash: hash.toLowerCase() } as unknown as ReplacementReturnType['transaction'],
      transaction,
      transactionReceipt,
    },
  };
}
