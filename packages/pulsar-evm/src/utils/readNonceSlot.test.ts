/**
 * The reader on the real viem against a scripted node: what it asks of the node is the whole point. A spec that replaces viem
 * could not see the walk over thousands of blocks, nor tell a free nonce from a transaction with no receipt yet.
 */
import { type Address, createPublicClient, custom, type Hex, numberToHex } from 'viem';
import { base } from 'viem/chains';
import { describe, expect, it } from 'vitest';

import { type NonceSlotScan, readNonceSlot } from './readNonceSlot';

const SENDER = '0x2222222222222222222222222222222222222222' as Address;
const NONCE = 7;
const OWN = `0x${'a'.repeat(64)}` as Hex;
const OTHER = `0x${'b'.repeat(64)}` as Hex;
const slot = { from: SENDER, nonce: NONCE };

type Node = {
  head: bigint;
  /** The block the nonce was spent in, and by what. */
  spentIn?: bigint;
  spender?: Hex;
  /** Whether the node has the receipt of the spender yet. */
  receipt?: boolean;
  /** `eth_getTransactionBySenderAndNonce`, which many nodes do not have. */
  direct?: boolean;
  /** A read of this block fails. */
  failing?: bigint;
  /** A node without old state: it answers the count of the newest block and of the `stateWindow` blocks below it. */
  pruned?: boolean;
  stateWindow?: bigint;
  /** What `eth_getLogs` answers; it refuses when there are none set. */
  logs?: { transactionHash: Hex }[];
  logReads?: unknown[];
  blocksRead: bigint[];
  countsRead: number;
};

function nodeOf(script: Partial<Node> & { head: bigint }) {
  const node: Node = { blocksRead: [], countsRead: 0, ...script };
  const transaction = (hash: Hex, blockNumber: bigint) => ({
    hash,
    from: SENDER,
    to: SENDER,
    nonce: numberToHex(NONCE),
    value: '0x0',
    input: '0x',
    gas: '0x5208',
    type: '0x2',
    maxFeePerGas: '0x1',
    maxPriorityFeePerGas: '0x1',
    chainId: numberToHex(base.id),
    blockNumber: numberToHex(blockNumber),
    blockHash: `0x${'c'.repeat(64)}`,
    transactionIndex: '0x0',
    r: '0x1',
    s: '0x1',
    v: '0x1',
    yParity: '0x1',
  });
  const request = async ({ method, params }: { method: string; params?: unknown }): Promise<unknown> => {
    const args = (params ?? []) as unknown[];
    switch (method) {
      case 'eth_chainId':
        return numberToHex(base.id);
      case 'eth_blockNumber':
        return numberToHex(node.head);
      case 'eth_getTransactionCount': {
        node.countsRead += 1;
        const at = args[1] as string;
        if (at === 'latest') return numberToHex(NONCE + (node.spentIn === undefined ? 0 : 1));
        if (node.pruned && BigInt(at) < node.head - (node.stateWindow ?? 0n)) {
          throw Object.assign(new Error('missing trie node'), { code: -32000 });
        }
        return numberToHex(NONCE + (node.spentIn !== undefined && BigInt(at) >= node.spentIn ? 1 : 0));
      }
      case 'eth_getLogs':
        (node.logReads ??= []).push(args[0]);
        if (!node.logs) throw Object.assign(new Error('query returned more than 10000 results'), { code: -32005 });
        return node.logs.map((log) => ({ ...log, address: SENDER, topics: [], data: '0x' }));
      case 'eth_getTransactionBySenderAndNonce':
        if (!node.direct) throw Object.assign(new Error('the method does not exist'), { code: -32601 });
        return node.spender ? { hash: node.spender } : null;
      case 'eth_getTransactionByHash':
        return args[0] === node.spender ? transaction(node.spender as Hex, node.spentIn as bigint) : null;
      case 'eth_getTransactionReceipt':
        if (args[0] !== node.spender || !node.receipt) return null;
        return {
          transactionHash: node.spender,
          from: SENDER,
          to: SENDER,
          blockNumber: numberToHex(node.spentIn as bigint),
          blockHash: `0x${'c'.repeat(64)}`,
          transactionIndex: '0x0',
          status: '0x1',
          gasUsed: '0x5208',
          cumulativeGasUsed: '0x5208',
          effectiveGasPrice: '0x1',
          logs: [],
          logsBloom: `0x${'0'.repeat(512)}`,
          contractAddress: null,
          type: '0x2',
        };
      case 'eth_getBlockByNumber': {
        const asked = BigInt(args[0] as string);
        node.blocksRead.push(asked);
        if (asked === node.failing) throw Object.assign(new Error('Too many requests'), { code: 429 });
        return {
          number: numberToHex(asked),
          hash: `0x${'d'.repeat(64)}`,
          parentHash: `0x${'e'.repeat(64)}`,
          timestamp: '0x1',
          transactions: asked === node.spentIn && node.spender ? [transaction(node.spender, asked)] : [],
        };
      }
      default:
        throw new Error(`Unexpected RPC method ${method}`);
    }
  };
  const client = createPublicClient({ chain: base, transport: custom({ request }, { retryCount: 0 }), cacheTime: 0 });
  return { node, client };
}

describe('readNonceSlot', () => {
  it('answers open only for a free nonce, and reads no block for it', async () => {
    const { node, client } = nodeOf({ head: 100n });
    expect(await readNonceSlot(client, { hash: OWN, slot })).toEqual({ state: 'open' });
    expect(node.blocksRead).toEqual([]);
  });

  // Both were `open`: an application could not tell that the nonce is gone, and took it for one that can still land
  describe('a transaction that spent the nonce, with no readable receipt yet', () => {
    it('found in a block', async () => {
      const { client } = nodeOf({ head: 100n, spentIn: 98n, spender: OTHER });
      expect(await readNonceSlot(client, { hash: OWN, slot, scan: {} })).toMatchObject({
        state: 'spender_found',
        transaction: { hash: OTHER },
      });
    });

    it('found by the node by its sender and nonce', async () => {
      const { node, client } = nodeOf({ head: 100n, spentIn: 98n, spender: OTHER, direct: true });
      expect(await readNonceSlot(client, { hash: OWN, slot })).toMatchObject({
        state: 'spender_found',
        transaction: { hash: OTHER },
      });
      expect(node.blocksRead).toEqual([]);
    });

    it('is replaced once its receipt is there', async () => {
      const { node, client } = nodeOf({ head: 100n, spentIn: 98n, spender: OTHER });
      const scan: NonceSlotScan = {};
      await readNonceSlot(client, { hash: OWN, slot, scan });
      node.receipt = true;
      expect(await readNonceSlot(client, { hash: OWN, slot, scan })).toMatchObject({ state: 'replaced' });
    });
  });

  // It read every block since the last reading, uncounted by `maxBlocks`: thousands in a row on a chain of fast blocks
  // The count came from a node at the newest block, the block number from one behind it
  it('reads nothing while this node does not see the nonce spent, and finds it once it does', async () => {
    const { node, client } = nodeOf({ head: 100_000n, spentIn: 100_001n, spender: OTHER, receipt: true });
    const scan: NonceSlotScan = {};
    expect(await readNonceSlot(client, { hash: OWN, slot, scan })).toEqual({ state: 'spent' });
    expect(node.blocksRead).toEqual([]);
    node.head = 100_003n;
    expect(await readNonceSlot(client, { hash: OWN, slot, scan })).toMatchObject({
      state: 'replaced',
      replacement: { transaction: { hash: OTHER } },
    });
    expect(node.blocksRead).toEqual([100_001n]);
  });

  // A public node keeps about the last 128 blocks of state: asking first for the far end failed on it, and every block was read
  describe('a node that keeps no old state', () => {
    const contractCall = { ...slot, to: SENDER, input: '0xa9059cbb' as Hex };

    it('finds a recent spend from the counts of what it keeps, with one full block', async () => {
      const { node, client } = nodeOf({
        head: 100_000n,
        spentIn: 99_950n,
        spender: OTHER,
        receipt: true,
        pruned: true,
        stateWindow: 128n,
      });
      expect(await readNonceSlot(client, { hash: OWN, slot, scan: {} })).toMatchObject({ state: 'replaced' });
      expect(node.blocksRead).toEqual([99_950n]);
      expect(node.countsRead).toBeLessThan(20);
    });

    it('goes down from where the counts stopped, as nothing newer can hold it', async () => {
      const { node, client } = nodeOf({
        head: 100_000n,
        spentIn: 99_860n,
        spender: OTHER,
        receipt: true,
        pruned: true,
        stateWindow: 128n,
      });
      expect(await readNonceSlot(client, { hash: OWN, slot, scan: {} })).toMatchObject({ state: 'replaced' });
      expect(node.blocksRead.length).toBeLessThanOrEqual(32);
      expect(node.blocksRead[0]).toBeLessThan(99_880n);
    });

    it('costs no more than its budget in full blocks, over all readings of a transaction', async () => {
      const { node, client } = nodeOf({
        head: 100_000n,
        spentIn: 5n,
        spender: OTHER,
        receipt: true,
        pruned: true,
        stateWindow: 128n,
      });
      const scan: NonceSlotScan = {};
      expect(await readNonceSlot(client, { hash: OWN, slot, scan })).toEqual({ state: 'spent' });
      const counts = node.countsRead;
      expect(await readNonceSlot(client, { hash: OWN, slot, scan })).toEqual({ state: 'spent' });
      expect(node.blocksRead).toHaveLength(32);
      expect(new Set(node.blocksRead).size).toBe(32);
      // Only the count of the newest block, which says the nonce is spent
      expect(node.countsRead).toBe(counts + 1);
    });

    it('goes on from the block a limit stopped it at', async () => {
      const { node, client } = nodeOf({ head: 1000n, spentIn: 5n, spender: OTHER, pruned: true, failing: 990n });
      const scan: NonceSlotScan = {};
      await expect(readNonceSlot(client, { hash: OWN, slot, scan })).rejects.toThrow();
      node.failing = undefined;
      node.blocksRead.length = 0;
      await readNonceSlot(client, { hash: OWN, slot, scan });
      expect(node.blocksRead[0]).toBe(990n);
      expect(node.blocksRead).toHaveLength(22);
    });

    it('finds an old spend of a contract call in the logs, with no full block', async () => {
      const { node, client } = nodeOf({
        head: 100_000n,
        spentIn: 90_000n,
        spender: OTHER,
        receipt: true,
        pruned: true,
        stateWindow: 128n,
        logs: [{ transactionHash: OTHER }],
      });
      expect(await readNonceSlot(client, { hash: OWN, slot: contractCall, scan: {} })).toMatchObject({
        state: 'replaced',
      });
      expect(node.blocksRead).toEqual([]);
      expect(node.logReads).toHaveLength(1);
    });

    it('takes from the logs only the transaction that spent this nonce', async () => {
      const { node, client } = nodeOf({
        head: 100_000n,
        spentIn: 90_000n,
        spender: OTHER,
        pruned: true,
        stateWindow: 128n,
        logs: [{ transactionHash: OWN }],
      });
      expect(await readNonceSlot(client, { hash: OWN, slot: contractCall, scan: {} })).toEqual({ state: 'spent' });
      expect(node.blocksRead).toHaveLength(32);
    });

    it('reads the logs once, and goes on when a node refuses them', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 5n, pruned: true, stateWindow: 128n });
      const scan: NonceSlotScan = {};
      await readNonceSlot(client, { hash: OWN, slot: contractCall, scan });
      await readNonceSlot(client, { hash: OWN, slot: contractCall, scan });
      expect(node.logReads).toHaveLength(1);
      expect(node.blocksRead).toHaveLength(32);
    });

    it('asks no logs for a plain transfer, which leaves none', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 5n, pruned: true, stateWindow: 128n });
      await readNonceSlot(client, { hash: OWN, slot, scan: {} });
      expect(node.logReads).toBeUndefined();
    });
  });

  it('answers spent when the scan reached as far back as it may and found nothing', async () => {
    const { node, client } = nodeOf({ head: 100n, spentIn: 1n, spender: OTHER, pruned: true });
    expect(await readNonceSlot(client, { hash: OWN, slot, maxBlocks: 5 })).toEqual({ state: 'spent' });
    expect(node.blocksRead).toHaveLength(5);
  });

  // Up to a thousand full blocks for one replaced transaction, on every wallet and server tracking one: a paid RPC bills them, and
  // a public one stops answering. The count of a block says whether the nonce was spent by then, so halving the range finds it
  describe('a node with old state', () => {
    it('reads only the block that spent the nonce, out of the whole reach', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 99_100n, spender: OTHER, receipt: true });
      const reading = await readNonceSlot(client, { hash: OWN, slot, scan: {} });
      expect(reading).toMatchObject({ state: 'replaced', replacement: { transaction: { hash: OTHER } } });
      expect(node.blocksRead).toEqual([99_100n]);
      expect(node.countsRead).toBeLessThan(25);
    });

    it('costs a few counts for what has just landed', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 99_999n, spender: OTHER, receipt: true });
      await readNonceSlot(client, { hash: OWN, slot, scan: {} });
      expect(node.blocksRead).toEqual([99_999n]);
      expect(node.countsRead).toBeLessThan(7);
    });

    it('finds the block at the far end of its reach', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 99_001n, spender: OTHER, receipt: true });
      await readNonceSlot(client, { hash: OWN, slot, scan: {} });
      expect(node.blocksRead).toEqual([99_001n]);
    });

    it('reads no block when the nonce was spent before the transaction could have been replaced', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 98_000n, spender: OTHER, receipt: true });
      expect(await readNonceSlot(client, { hash: OWN, slot, fromBlock: 99_000n, scan: {} })).toEqual({
        state: 'spent',
      });
      expect(node.blocksRead).toEqual([]);
    });

    // The limit of a thousand blocks was for block reads, and it ended a replacement older than that as Replaced with no reason
    it('goes as far back as the chain for a few counts', async () => {
      const { node, client } = nodeOf({ head: 1_000_000n, spentIn: 5n, spender: OTHER, receipt: true });
      expect(await readNonceSlot(client, { hash: OWN, slot, scan: {} })).toMatchObject({ state: 'replaced' });
      expect(node.blocksRead).toEqual([5n]);
      expect(node.countsRead).toBeLessThan(45);
    });

    it('asks again only for the block it found, while the receipt is on its way', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 99_100n, spender: OTHER });
      const scan: NonceSlotScan = {};
      expect(await readNonceSlot(client, { hash: OWN, slot, scan })).toMatchObject({ state: 'spender_found' });
      const counts = node.countsRead;
      node.receipt = true;
      expect(await readNonceSlot(client, { hash: OWN, slot, scan })).toMatchObject({ state: 'replaced' });
      expect(node.blocksRead).toEqual([99_100n, 99_100n]);
      expect(node.countsRead).toBe(counts + 1);
    });

    // An EIP-7702 authorization spends the nonce inside someone else's transaction: the block holds nothing of the sender
    it('answers spent from that one block when no transaction of the sender is in it, and reads it once', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 99_100n });
      const scan: NonceSlotScan = {};
      expect(await readNonceSlot(client, { hash: OWN, slot, scan })).toEqual({ state: 'spent' });
      expect(await readNonceSlot(client, { hash: OWN, slot, scan })).toEqual({ state: 'spent' });
      expect(node.blocksRead).toEqual([99_100n]);
    });

    it('goes back to reading blocks when a count fails on the way', async () => {
      const { node, client } = nodeOf({ head: 100n, spentIn: 98n, spender: OTHER, pruned: true });
      expect(await readNonceSlot(client, { hash: OWN, slot, scan: {} })).toMatchObject({ state: 'spender_found' });
      expect(node.blocksRead).toEqual([100n, 99n, 98n]);
    });
  });
});
