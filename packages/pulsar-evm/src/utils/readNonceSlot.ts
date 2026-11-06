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
  pad,
  ReplacementReason,
  ReplacementReturnType,
  TransactionReceipt,
} from 'viem';
import { getBlock, getBlockNumber, getTransaction, getTransactionCount, getTransactionReceipt } from 'viem/actions';

/**
 * How many full blocks a transaction may cost, block by block, on a node that keeps no old state: the last step of the search, for a
 * spend older than what the node remembers.
 */
const DEFAULT_MAX_WALKED_BLOCKS = 32;
/** The range one read of logs covers: a single call over what would be that many full blocks. Nodes may refuse more. */
const LOG_SEARCH_BLOCKS = 2000n;
/** How many transactions found in the logs are looked at, newest first. */
const LOG_CANDIDATES = 8;

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
 *   it: an EIP-7702 authorization in someone else's transaction, a replacement further back than the search may reach, or a
 *   node behind its load balancer. Read it again before believing it.
 */
export type NonceSlotReading =
  | { state: 'open' }
  | { state: 'spender_found'; transaction: GetTransactionReturnType }
  | { state: 'ours'; receipt?: TransactionReceipt }
  | { state: 'replaced'; replacement: ReplacementReturnType }
  | { state: 'spent' };

/**
 * How far {@link readNonceSlot} has searched. Pass the same object to every reading of one transaction: each goes on where the last
 * one stopped, so a node that limits requests still gets it to the end, and a block is read once.
 */
export type NonceSlotScan = {
  /** The oldest block read one by one. */
  oldest?: bigint;
  /** How many blocks were read one by one, up to `maxBlocks`. */
  walked?: number;
  /** The block whose count shows the nonce spent, when the node has its state: the only block that needs reading. */
  spentIn?: bigint;
  /** The oldest block the node could answer a count for, with the nonce already spent there. */
  edge?: bigint;
  /** Whether the logs were read, which is done once. */
  logsRead?: boolean;
  /** Whether the node has no `eth_getTransactionBySenderAndNonce`. */
  noDirectLookup?: boolean;
  /** The block that spent the nonce holds no transaction of the sender: an EIP-7702 authorization in someone else's. */
  spenderUnreadable?: boolean;
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

/** What the sender's counts at past blocks tell of the block that spent the nonce. */
type SpentBlock =
  /** That block. */
  | { state: 'in'; block: bigint }
  /** Spent before `lowest`, so no block in reach can hold it. */
  | { state: 'before' }
  /** Spent at `edge` or earlier: the node keeps no state older than that. */
  | { state: 'older'; edge: bigint }
  /** This node does not see the nonce spent yet, or cannot be read: ask again. */
  | { state: 'unknown' };

/**
 * The block that spent the nonce, from the sender's count at past blocks: from the newest back in growing steps, as a tracker asks
 * soon after a replacement lands, then halving what is left. About two calls per doubling of the distance, where a walk reads every
 * block in between. It starts at the newest block on purpose: asking first for the far end failed on a node with no old state,
 * though that node keeps the state of the blocks a replacement has just landed in.
 */
async function blockThatSpent(client: Client, slot: NonceSlot, latest: bigint, lowest: bigint): Promise<SpentBlock> {
  const spentBy = async (blockNumber: bigint) =>
    (await getTransactionCount(client, { address: slot.from, blockNumber })) > slot.nonce;
  const below = lowest > 0n ? lowest - 1n : 0n;
  try {
    if (!(await spentBy(latest))) return { state: 'unknown' };
  } catch {
    return { state: 'unknown' };
  }
  let spent = latest;
  let firstFree: bigint | undefined;
  for (let step = 1n; firstFree === undefined; step *= 2n) {
    const at = spent - step > below ? spent - step : below;
    try {
      if (await spentBy(at)) {
        if (at === below) return { state: 'before' };
        spent = at;
      } else {
        firstFree = at;
      }
    } catch {
      return { state: 'older', edge: spent };
    }
  }
  let free = firstFree;
  while (spent - free > 1n) {
    const middle = (spent + free) / 2n;
    try {
      if (await spentBy(middle)) spent = middle;
      else free = middle;
    } catch {
      return { state: 'older', edge: spent };
    }
  }
  return { state: 'in', block: spent };
}

/** Whether a transaction is the one that spent the nonce. */
const spendsTheSlot = (transaction: GetTransactionReturnType, slot: NonceSlot) =>
  isAddressEqual(transaction.from, slot.from) && Number(transaction.nonce) === Number(slot.nonce);

/**
 * The transaction that spent the nonce, from the logs of the contract the tracked transaction called: one call over the range, for
 * a transfer or anything else that names the sender in an indexed topic. A speed-up calls the same contract with the same data.
 */
async function inLogs(
  client: Client,
  slot: NonceSlot,
  edge: bigint,
  lowest: bigint,
): Promise<GetTransactionReturnType | null> {
  if (!slot.to || !slot.input || slot.input === '0x') return null;
  const from = edge - lowest > LOG_SEARCH_BLOCKS ? edge - LOG_SEARCH_BLOCKS : lowest;
  const request = client.request as unknown as (args: {
    method: string;
    params: unknown[];
  }) => Promise<{ transactionHash: Hex | null }[]>;
  const logs = await request({
    method: 'eth_getLogs',
    params: [
      {
        address: slot.to,
        fromBlock: numberToHex(from),
        toBlock: numberToHex(edge),
        topics: [null, pad(slot.from.toLowerCase() as Hex)],
      },
    ],
  }).catch(() => []);
  const hashes = [...new Set(logs.map((log) => log.transactionHash).filter((hash): hash is Hex => Boolean(hash)))];
  for (const hash of hashes.reverse().slice(0, LOG_CANDIDATES)) {
    const transaction = await getTransaction(client, { hash }).catch(() => null);
    if (transaction && spendsTheSlot(transaction, slot)) return transaction;
  }
  return null;
}

/**
 * The transaction that spent the nonce, or `null` when it could not be found, cheapest way first, stopping at the first answer: the
 * node's own lookup; the sender's counts; for a spend older than the node's state the logs, then a few blocks read one by one from
 * that edge down, as the counts have shown everything newer holds nothing.
 */
async function findSpender(
  client: Client,
  slot: NonceSlot,
  fromBlock: bigint | undefined,
  maxBlocks: number,
  scan: NonceSlotScan,
): Promise<GetTransactionReturnType | null> {
  if (!scan.noDirectLookup) {
    const request = client.request as unknown as (args: {
      method: string;
      params: unknown[];
    }) => Promise<{ hash: Hex } | null>;
    const direct = await request({
      method: 'eth_getTransactionBySenderAndNonce',
      params: [slot.from, numberToHex(slot.nonce)],
    }).catch(() => {
      scan.noDirectLookup = true;
      return null;
    });
    if (direct?.hash) {
      const transaction = await getTransaction(client, { hash: direct.hash }).catch(() => null);
      if (transaction) return transaction;
    }
  }

  if (scan.spenderUnreadable) return null;
  const lowest = fromBlock ?? 0n;
  const inBlock = async (blockNumber: bigint) => {
    const block = await getBlock(client, { blockNumber, includeTransactions: true });
    const found = block.transactions.find((t) => spendsTheSlot(t as GetTransactionReturnType, slot));
    return (found as GetTransactionReturnType | undefined) ?? null;
  };

  // What an earlier reading found, while its receipt is on the way. Gone from there, a reorganization moved it
  const known = scan.spentIn;
  if (known !== undefined) {
    const found = await inBlock(known);
    if (found) return found;
    scan.spentIn = undefined;
  }

  const walked = () => scan.walked ?? 0;
  const walkLeft = () => walked() < maxBlocks && (scan.oldest ?? (scan.edge as bigint) + 1n) > lowest;
  // Everything this transaction may cost was spent: nothing more to ask
  if (scan.edge !== undefined && scan.logsRead && !walkLeft()) return null;

  const latest = await getBlockNumber(client, { cacheTime: 0 });
  const located = await blockThatSpent(client, slot, latest, lowest);
  if (located.state === 'in') {
    scan.spentIn = located.block;
    if (located.block === known) return null;
    const found = await inBlock(located.block);
    // Nothing of the sender in the block that spent the nonce: no other block can hold it
    if (!found) {
      scan.spentIn = undefined;
      scan.spenderUnreadable = true;
    }
    return found;
  }
  if (located.state !== 'older') return null;

  scan.edge = located.edge;
  if (!scan.logsRead) {
    scan.logsRead = true;
    const found = await inLogs(client, slot, located.edge, lowest);
    if (found) return found;
  }
  scan.oldest ??= located.edge + 1n;
  // Each block is marked read only after it was, so an RPC error here makes the next reading go on from this block
  while (walkLeft()) {
    const found = await inBlock(scan.oldest - 1n);
    if (found) return found;
    scan.oldest -= 1n;
    scan.walked = walked() + 1;
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
 * `eth_getTransactionBySenderAndNonce` where the node has it, otherwise `eth_getTransactionCount` at past blocks to find the block
 * that spent it, about two calls per doubling of its distance, and that one full block. Only for a spend older than what a node
 * without old state remembers: one `eth_getLogs` when the transaction called a contract, then up to `maxBlocks` full blocks in all,
 * going down from where the counts stopped.
 *
 * @param client - The viem client of the chain.
 * @param params - The transaction and how far back to look.
 * @param params.hash - The hash of the tracked transaction.
 * @param params.slot - Its sender and nonce.
 * @param params.fromBlock - A block no replacement can be older than, when known.
 * @param params.maxBlocks - The most full blocks to read one by one, over all readings of a transaction. Defaults to 32.
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
  const { hash, slot, fromBlock, maxBlocks = DEFAULT_MAX_WALKED_BLOCKS, scan = {} } = params;

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
