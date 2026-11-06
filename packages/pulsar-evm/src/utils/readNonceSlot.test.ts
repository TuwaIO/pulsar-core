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
  blocksRead: bigint[];
};

function nodeOf(script: Partial<Node> & { head: bigint }) {
  const node: Node = { blocksRead: [], ...script };
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
      case 'eth_getTransactionCount':
        return numberToHex(NONCE + (node.spentIn === undefined ? 0 : 1));
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
  describe('blocks above the first reading', () => {
    it('reads no more of them than nodes can disagree on, however far the chain went', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 1n, spender: OTHER });
      const scan: NonceSlotScan = {};
      await readNonceSlot(client, { hash: OWN, slot, scan, maxBlocks: 10 });
      node.blocksRead.length = 0;
      node.head = 114_400n;
      await readNonceSlot(client, { hash: OWN, slot, scan, maxBlocks: 10 });
      const above = node.blocksRead.filter((block) => block > 100_000n);
      expect(above).toHaveLength(16);
      expect(Math.max(...above.map(Number))).toBe(100_016);
    });

    it('holds to that after a reading the node failed, too', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 1n, spender: OTHER, failing: 99_995n });
      const scan: NonceSlotScan = {};
      await expect(readNonceSlot(client, { hash: OWN, slot, scan })).rejects.toThrow();
      node.failing = undefined;
      node.blocksRead.length = 0;
      node.head = 114_400n;
      await readNonceSlot(client, { hash: OWN, slot, scan, maxBlocks: 10 });
      expect(node.blocksRead.filter((block) => block > 100_016n)).toEqual([]);
    });

    // The count came from a node at the newest block, the block number from one behind it
    it('finds a replacement in the block above the first reading', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 100_001n, spender: OTHER, receipt: true });
      const scan: NonceSlotScan = {};
      expect(await readNonceSlot(client, { hash: OWN, slot, scan, maxBlocks: 10 })).toEqual({ state: 'spent' });
      node.head = 100_003n;
      expect(await readNonceSlot(client, { hash: OWN, slot, scan, maxBlocks: 10 })).toMatchObject({
        state: 'replaced',
        replacement: { transaction: { hash: OTHER } },
      });
    });

    it('reads each of them once', async () => {
      const { node, client } = nodeOf({ head: 100_000n, spentIn: 1n, spender: OTHER });
      const scan: NonceSlotScan = {};
      await readNonceSlot(client, { hash: OWN, slot, scan, maxBlocks: 10 });
      node.head = 100_020n;
      await readNonceSlot(client, { hash: OWN, slot, scan, maxBlocks: 10 });
      node.head = 100_040n;
      await readNonceSlot(client, { hash: OWN, slot, scan, maxBlocks: 10 });
      const above = node.blocksRead.filter((block) => block > 100_000n);
      expect(new Set(above).size).toBe(above.length);
      expect(above).toHaveLength(16);
    });
  });

  it('answers spent when the scan reached as far back as it may and found nothing', async () => {
    const { client } = nodeOf({ head: 100n, spentIn: 1n, spender: OTHER });
    expect(await readNonceSlot(client, { hash: OWN, slot, maxBlocks: 5 })).toEqual({ state: 'spent' });
  });
});
