/**
 * @file Runs the EVM tracker with the real viem against a scripted JSON-RPC node, with no mock of `viem/actions`.
 *
 * Every other tracker test mocks `waitForTransactionReceipt` and fires `onReplaced` by hand, so they stayed green while a
 * wallet's speed-up went unnoticed: viem forgets the transaction between two calls, and a node drops the old hash once
 * the replacement reaches it. Only a test on the real viem can see that. The times below are seconds from the start of
 * tracking; the windows of the default tracker are 0-60, 65-125, 135-195, 210-270, 290-350 and 375-435.
 */

import { Transaction, TransactionStatus } from '@tuwaio/pulsar-core';
import { createConfig } from '@wagmi/core';
import { Address, createClient, custom, Hex, numberToHex, WaitForTransactionReceiptTimeoutError } from 'viem';
import { sepolia } from 'viem/chains';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { evmTracker, evmTrackerForStore } from './evmTracker';

const SENDER = '0xad9a211d227d2d9c1b5573f73cda0284b758ac0c' as Address;
const RECIPIENT = '0xb8d9b1ec1c1f8bea7fb10450198c0b47d50c96b7' as Address;
const OLD_HASH = `0x${'a'.repeat(64)}` as Hex;
const NEW_HASH = `0x${'b'.repeat(64)}` as Hex;
const NONCE = 1932;
const VALUE = 1000n;
const FIRST_BLOCK = 1_000;
const BLOCK_SECONDS = 12;

type Script = {
  /** Until when, in seconds, the node returns the old transaction by its hash. */
  knownUntil?: number;
  /** When the replacement is mined; before 0 it was mined before tracking began. */
  replacementMinedAt?: number;
  /** The replacing transaction, when it is not the same transfer. */
  replacement?: { to?: Address; value?: bigint; input?: Hex };
  /** When the old transaction itself is mined. */
  minedAt?: number;
  /** The status of the mined transaction. */
  receiptStatus?: 'success' | 'reverted';
  /** When a transaction of no sender (an authorization in someone else's) spends the nonce. */
  spentWithoutTransactionAt?: number;
  /** Whether the node has `eth_getTransactionBySenderAndNonce`. */
  slotMethod?: boolean;
  /** How many reads of the replacement's receipt find nothing, like a lagging node behind a load balancer. */
  receiptLagReads?: number;
  /** A method that fails once, the first time it is called after the replacement is mined. */
  failOnce?: string;
  /** Whether `eth_getBlockByNumber` always fails. */
  unreadableBlocks?: boolean;
};

const rpcTransaction = (fields: {
  hash: Hex;
  blockNumber: number | null;
  to?: Address;
  value?: bigint;
  input?: Hex;
  from?: Address;
}) => ({
  hash: fields.hash,
  from: fields.from ?? SENDER,
  to: fields.to ?? RECIPIENT,
  nonce: numberToHex(NONCE),
  value: numberToHex(fields.value ?? VALUE),
  input: fields.input ?? '0x',
  gas: '0x5208',
  type: '0x2',
  maxFeePerGas: '0x3b9aca00',
  maxPriorityFeePerGas: '0x3b9aca00',
  chainId: numberToHex(sepolia.id),
  blockNumber: fields.blockNumber === null ? null : numberToHex(fields.blockNumber),
  blockHash: fields.blockNumber === null ? null : `0x${'c'.repeat(64)}`,
  transactionIndex: fields.blockNumber === null ? null : '0x0',
  r: '0x1',
  s: '0x1',
  v: '0x1',
  yParity: '0x1',
});

const rpcReceipt = (hash: Hex, blockNumber: number, status: 'success' | 'reverted') => ({
  transactionHash: hash,
  from: SENDER,
  to: RECIPIENT,
  blockNumber: numberToHex(blockNumber),
  blockHash: `0x${'c'.repeat(64)}`,
  transactionIndex: '0x0',
  status: status === 'success' ? '0x1' : '0x0',
  gasUsed: '0x5208',
  cumulativeGasUsed: '0x5208',
  effectiveGasPrice: '0x3b9aca00',
  logs: [],
  logsBloom: `0x${'0'.repeat(512)}`,
  contractAddress: null,
  type: '0x2',
});

const blockAt = (seconds: number) => FIRST_BLOCK + Math.floor(seconds / BLOCK_SECONDS);

/** A node whose answers depend only on the time since tracking began and the script. */
function scriptedNode(script: Script) {
  const startedAt = Date.now();
  const now = () => (Date.now() - startedAt) / 1000;
  const failed = new Set<string>();
  let receiptLag = script.receiptLagReads ?? 0;
  const calls: string[] = [];

  const replacementBlock = script.replacementMinedAt === undefined ? null : blockAt(script.replacementMinedAt);
  const ownBlock = script.minedAt === undefined ? null : blockAt(script.minedAt);
  const spentBlock = script.spentWithoutTransactionAt === undefined ? null : blockAt(script.spentWithoutTransactionAt);
  // A block has one content from the moment it exists, so everything is mined with the block its time falls in
  const reached = (block: number | null) => block !== null && blockAt(now()) >= block;
  const replacementMined = () => reached(replacementBlock);
  const ownMined = () => reached(ownBlock);
  const spent = () => reached(spentBlock);

  const request = async ({ method, params }: { method: string; params?: unknown }): Promise<unknown> => {
    const args = (params ?? []) as unknown[];
    calls.push(method);
    if (script.unreadableBlocks && method === 'eth_getBlockByNumber') throw new Error('Internal JSON-RPC error.');
    if (script.failOnce === method && replacementMined() && !failed.has(method)) {
      failed.add(method);
      throw new Error('Internal JSON-RPC error.');
    }
    switch (method) {
      case 'eth_chainId':
        return numberToHex(sepolia.id);
      case 'eth_blockNumber':
        return numberToHex(blockAt(now()));
      case 'eth_getTransactionByHash': {
        if (args[0] === NEW_HASH && replacementMined()) {
          return rpcTransaction({ hash: NEW_HASH, blockNumber: replacementBlock, ...script.replacement });
        }
        if (args[0] !== OLD_HASH) return null;
        if (ownMined()) return rpcTransaction({ hash: OLD_HASH, blockNumber: ownBlock });
        if (replacementMined() || spent()) return null;
        return now() < (script.knownUntil ?? Infinity) ? rpcTransaction({ hash: OLD_HASH, blockNumber: null }) : null;
      }
      case 'eth_getTransactionReceipt': {
        if (args[0] === OLD_HASH && ownMined()) {
          return rpcReceipt(OLD_HASH, ownBlock as number, script.receiptStatus ?? 'success');
        }
        if (args[0] === NEW_HASH && replacementMined()) {
          if (receiptLag > 0) {
            receiptLag -= 1;
            return null;
          }
          return rpcReceipt(NEW_HASH, replacementBlock as number, script.receiptStatus ?? 'success');
        }
        return null;
      }
      case 'eth_getTransactionCount':
        return numberToHex(NONCE + (replacementMined() || ownMined() || spent() ? 1 : 0));
      case 'eth_getTransactionBySenderAndNonce': {
        if (!script.slotMethod) throw Object.assign(new Error('the method does not exist'), { code: -32601 });
        if (replacementMined()) {
          return rpcTransaction({ hash: NEW_HASH, blockNumber: replacementBlock, ...script.replacement });
        }
        if (ownMined()) return rpcTransaction({ hash: OLD_HASH, blockNumber: ownBlock });
        return null;
      }
      case 'eth_getBlockByNumber': {
        const asked = args[0] === 'latest' ? blockAt(now()) : Number(args[0]);
        const transactions: unknown[] = [];
        if (asked === replacementBlock && replacementMined()) {
          transactions.push(rpcTransaction({ hash: NEW_HASH, blockNumber: asked, ...script.replacement }));
        }
        if (asked === ownBlock && ownMined()) {
          transactions.push(rpcTransaction({ hash: OLD_HASH, blockNumber: asked }));
        }
        return {
          number: numberToHex(asked),
          hash: `0x${'d'.repeat(64)}`,
          parentHash: `0x${'e'.repeat(64)}`,
          timestamp: numberToHex(1_700_000_000 + asked * BLOCK_SECONDS),
          transactions: args[1] ? transactions : [],
        };
      }
      default:
        throw new Error(`Unexpected RPC method ${method}`);
    }
  };

  return { request, calls };
}

function setup(script: Script) {
  const node = scriptedNode(script);
  const config = createConfig({
    chains: [sepolia],
    client: ({ chain }) => createClient({ chain, transport: custom({ request: node.request }, { retryCount: 0 }) }),
  });
  return { node, config };
}

const pass = (seconds: number) => vi.advanceTimersByTimeAsync(seconds * 1000);

describe('evmTracker on the real viem', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function track(script: Script, extra: Partial<Parameters<typeof evmTracker>[0]> = {}) {
    const { config, node } = setup(script);
    const callbacks = {
      onTxDetailsFetched: vi.fn(),
      onSuccess: vi.fn().mockResolvedValue(undefined),
      onFailure: vi.fn(),
      onReplaced: vi.fn(),
    };
    void evmTracker({ tx: { txKey: OLD_HASH, chainId: sepolia.id }, config, ...callbacks, ...extra });
    return { ...callbacks, node };
  }

  describe('sees a wallet speed-up at any moment', () => {
    test.each([
      ['inside the first window', { knownUntil: 40, replacementMinedAt: 48 }],
      ['the node dropped the hash before a fresh window, mined inside it', { knownUntil: 60, replacementMinedAt: 72 }],
      ['mined in the pause between two windows', { knownUntil: 120, replacementMinedAt: 132 }],
      [
        'on the timing of the live test: mined at 192 s, as a window ends',
        { knownUntil: 180, replacementMinedAt: 192 },
      ],
      ['past the old 180 s limit, inside a later window', { knownUntil: 200, replacementMinedAt: 216 }],
      ['the node dropped a low-fee hash long before the speed-up', { knownUntil: 10, replacementMinedAt: 300 }],
      ['with the slot method on the node', { knownUntil: 120, replacementMinedAt: 132, slotMethod: true }],
    ])('%s', async (_name, script) => {
      const tracker = track(script);

      await pass(450);

      expect(tracker.onFailure).not.toHaveBeenCalled();
      expect(tracker.onSuccess).not.toHaveBeenCalled();
      expect(tracker.onReplaced).toHaveBeenCalledOnce();
      const replacement = tracker.onReplaced.mock.calls[0][0];
      expect(replacement.reason).toBe('repriced');
      expect(replacement.transaction.hash).toBe(NEW_HASH);
      expect(replacement.transactionReceipt.transactionHash).toBe(NEW_HASH);
      expect(replacement.replacedTransaction.nonce).toBe(NONCE);
    });

    test('a replacement whose receipt lags behind its block is still reported', async () => {
      const tracker = track({ knownUntil: 40, replacementMinedAt: 48, receiptLagReads: 1 });

      await pass(450);

      expect(tracker.onFailure).not.toHaveBeenCalled();
      expect(tracker.onReplaced).toHaveBeenCalledOnce();
    });

    test('one RPC error while the block is read does not lose the replacement', async () => {
      const tracker = track({ knownUntil: 40, replacementMinedAt: 48, failOnce: 'eth_getBlockByNumber' });

      await pass(450);

      expect(tracker.onFailure).not.toHaveBeenCalled();
      expect(tracker.onReplaced).toHaveBeenCalledOnce();
    });

    test('a cancel is told from a speed-up', async () => {
      const tracker = track({
        knownUntil: 120,
        replacementMinedAt: 132,
        replacement: { to: SENDER, value: 0n },
      });

      await pass(450);

      expect(tracker.onReplaced.mock.calls[0][0].reason).toBe('cancelled');
    });

    test('another transaction in the slot is told from a speed-up', async () => {
      const tracker = track({
        knownUntil: 120,
        replacementMinedAt: 132,
        replacement: { to: SENDER, value: 5n },
      });

      await pass(450);

      expect(tracker.onReplaced.mock.calls[0][0].reason).toBe('replaced');
    });
  });

  describe('what it knows from an earlier run', () => {
    const knownDetails = { from: SENDER, nonce: NONCE, to: RECIPIENT, value: VALUE, input: '0x' as Hex };

    test('a replacement mined before tracking restarted is found, by scanning blocks', async () => {
      const tracker = track({ knownUntil: 0, replacementMinedAt: -600 }, { knownDetails });

      await pass(120);

      expect(tracker.onFailure).not.toHaveBeenCalled();
      expect(tracker.onReplaced).toHaveBeenCalledOnce();
      expect(tracker.onReplaced.mock.calls[0][0].transaction.hash).toBe(NEW_HASH);
      expect(tracker.onReplaced.mock.calls[0][0].reason).toBe('repriced');
    });

    test('a replacement mined before tracking restarted is found through the slot method', async () => {
      const tracker = track({ knownUntil: 0, replacementMinedAt: -600, slotMethod: true }, { knownDetails });

      await pass(5);

      expect(tracker.node.calls).toContain('eth_getTransactionBySenderAndNonce');
      expect(tracker.node.calls).not.toContain('eth_getBlockByNumber');
      expect(tracker.onReplaced).toHaveBeenCalledOnce();
    });

    test('a hash the node does not show with a free nonce keeps waiting, and its receipt is read', async () => {
      const tracker = track({ knownUntil: 0, minedAt: 100 }, { knownDetails });

      await pass(40);
      expect(tracker.onFailure).not.toHaveBeenCalled();

      await pass(200);
      expect(tracker.onFailure).not.toHaveBeenCalled();
      expect(tracker.onSuccess).toHaveBeenCalledOnce();
    });

    test('a nonce spent by no readable transaction ends tracking only after repeated readings', async () => {
      const tracker = track({ knownUntil: 0, spentWithoutTransactionAt: -60 }, { knownDetails });

      // One reading could be a node behind its load balancer
      await pass(10);
      expect(tracker.onFailure).not.toHaveBeenCalled();

      await pass(440);
      expect(tracker.onFailure).toHaveBeenCalledOnce();
      expect((tracker.onFailure.mock.calls[0][0] as Error).name).toBe('NonceSlotSpentError');
    });
  });

  describe('a transaction it has no answer for', () => {
    test('gives up after its attempts: 6 windows and their pauses, 435 s', async () => {
      const tracker = track({});

      await pass(434);
      expect(tracker.onFailure).not.toHaveBeenCalled();

      await pass(3);
      expect(tracker.onFailure).toHaveBeenCalledOnce();
      expect(tracker.onFailure.mock.calls[0][0]).toBeInstanceOf(WaitForTransactionReceiptTimeoutError);
    });

    test('a hash the node never showed fails after its lookups: a server reports it as not found', async () => {
      const tracker = track({ knownUntil: 0 });

      await pass(26);
      expect(tracker.onFailure).not.toHaveBeenCalled();

      await pass(2);
      expect(tracker.onFailure).toHaveBeenCalledOnce();
      expect(tracker.onTxDetailsFetched).not.toHaveBeenCalled();
    });

    test('a mined transaction is reported even if the wait began long before it', async () => {
      const tracker = track({ minedAt: 400 });

      await pass(420);

      expect(tracker.onSuccess).toHaveBeenCalledOnce();
      expect(tracker.onFailure).not.toHaveBeenCalled();
    });
  });

  describe('callbacks', () => {
    test('a throwing onReplaced never turns a replacement into a failure', async () => {
      const onReplaced = vi.fn(() => {
        throw new Error('app bug');
      });
      const tracker = track({ knownUntil: 40, replacementMinedAt: 48 }, { onReplaced });

      await pass(450);

      expect(onReplaced).toHaveBeenCalledOnce();
      expect(tracker.onFailure).not.toHaveBeenCalled();
    });

    test('a replacement waits for the required confirmations, like the transaction it replaced', async () => {
      const onConfirmationsUpdate = vi.fn();
      const { config } = setup({ knownUntil: 40, replacementMinedAt: 48 });
      const onReplaced = vi.fn();
      void evmTracker({
        tx: { txKey: OLD_HASH, chainId: sepolia.id, requiredConfirmations: 3 },
        config,
        onTxDetailsFetched: vi.fn(),
        onSuccess: vi.fn(),
        onFailure: vi.fn(),
        onReplaced,
        onConfirmationsUpdate,
      });

      // Mined in the block of second 48: the third confirmation comes with the block of second 72
      await pass(60);
      expect(onReplaced).not.toHaveBeenCalled();

      await pass(30);
      expect(onConfirmationsUpdate).toHaveBeenCalled();
      expect(onReplaced).toHaveBeenCalledOnce();
    });
  });
});

describe('evmTrackerForStore on the real viem', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function trackInStore(script: Script, stored: Record<string, unknown> = {}) {
    const { config } = setup(script);
    const tx = {
      txKey: OLD_HASH,
      chainId: sepolia.id,
      adapter: 'evm',
      tracker: 'ethereum',
      pending: true,
      localTimestamp: Math.floor(Date.now() / 1000),
      from: SENDER,
      type: 'test',
      connectorType: 'evm:metamask',
      ...stored,
    } as unknown as Transaction;
    const pool: Record<string, Transaction> = { [OLD_HASH]: tx };
    const callbacks = { onSuccess: vi.fn(), onError: vi.fn(), onReplaced: vi.fn() };
    void evmTrackerForStore({
      tx,
      config,
      transactionsPool: pool,
      updateTxParams: (key, fields) => {
        pool[key] = { ...pool[key], ...fields } as Transaction;
      },
      ...callbacks,
    });
    return { pool, ...callbacks, current: () => pool[OLD_HASH] as Transaction & Record<string, unknown> };
  }

  test('time alone never means Failed: a slow transaction is still pending after an hour, then succeeds', async () => {
    const store = trackInStore({ minedAt: 3700 });

    await pass(3600);
    expect(store.current().pending).toBe(true);
    expect(store.current().status).toBeUndefined();
    expect(store.onError).not.toHaveBeenCalled();

    await pass(200);
    expect(store.current().status).toBe(TransactionStatus.Success);
    expect(store.onSuccess).toHaveBeenCalledOnce();
  });

  test('the tracker saves the on-chain sender with the details, for a later run', async () => {
    const store = trackInStore({});

    await pass(5);

    expect(store.current().sender).toBe(SENDER);
    expect(store.current().nonce).toBe(NONCE);
  });

  test('a replacement names its reason and its hash, past the old give-up time', async () => {
    const store = trackInStore({ knownUntil: 500, replacementMinedAt: 504 });

    await pass(800);

    expect(store.current().status).toBe(TransactionStatus.Replaced);
    expect(store.current().replacedTxHash).toBe(NEW_HASH);
    expect(store.current().replacedReason).toBe('repriced');
    expect(store.current().pending).toBe(false);
    expect(store.current().isError).toBe(false);
    expect(store.current().finishedTimestamp).toBe(1_700_000_000 + blockAt(504) * BLOCK_SECONDS);
    expect(store.onReplaced).toHaveBeenCalledOnce();
    expect(store.onError).not.toHaveBeenCalled();
  });

  test('a cancel is stored as cancelled', async () => {
    const store = trackInStore({ knownUntil: 100, replacementMinedAt: 108, replacement: { to: SENDER, value: 0n } });

    await pass(300);

    expect(store.current().replacedReason).toBe('cancelled');
  });

  test('a speed-up that reverted is an error', async () => {
    const store = trackInStore({ knownUntil: 100, replacementMinedAt: 108, receiptStatus: 'reverted' });

    await pass(300);

    expect(store.current().status).toBe(TransactionStatus.Replaced);
    expect(store.current().isError).toBe(true);
  });

  test('a reload after the speed-up landed reports it, from the saved sender and nonce', async () => {
    const store = trackInStore(
      { knownUntil: 0, replacementMinedAt: -300 },
      { sender: SENDER, nonce: NONCE, to: RECIPIENT, value: VALUE.toString(), input: '0x' },
    );

    await pass(60);

    expect(store.current().status).toBe(TransactionStatus.Replaced);
    expect(store.current().replacedTxHash).toBe(NEW_HASH);
    expect(store.current().replacedReason).toBe('repriced');
    expect(store.onError).not.toHaveBeenCalled();
  });

  test('a saved `from` without the on-chain sender is not trusted as the owner of the nonce', async () => {
    // A relayed transaction: `from` is the wallet, the nonce belongs to the relayer
    const store = trackInStore({ knownUntil: 0, spentWithoutTransactionAt: -60 }, { nonce: NONCE });

    await pass(120);

    expect(store.current().pending).toBe(true);
    expect(store.current().status).toBeUndefined();
  });

  test('a nonce spent by no readable transaction is stored as replaced by something unknown, not as failed', async () => {
    const store = trackInStore(
      { knownUntil: 0, spentWithoutTransactionAt: -60 },
      { sender: SENDER, nonce: NONCE, to: RECIPIENT, value: VALUE.toString(), input: '0x' },
    );

    await pass(600);

    expect(store.current().status).toBe(TransactionStatus.Replaced);
    expect(store.current().replacedReason).toBe('unknown');
    expect(store.current().replacedTxHash).toBeUndefined();
    expect(store.current().isError).toBeFalsy();
    expect(store.onReplaced).toHaveBeenCalledOnce();
    expect(store.onError).not.toHaveBeenCalled();
  });

  test('a hash nobody ever showed, with nothing saved, stays pending for a day and then fails', async () => {
    const store = trackInStore({ knownUntil: 0 });

    await pass(3600);
    expect(store.current().pending).toBe(true);
    expect(store.onError).not.toHaveBeenCalled();

    await pass(23 * 3600 + 60);
    expect(store.current().status).toBe(TransactionStatus.Failed);
    expect(store.onError).toHaveBeenCalledOnce();
  });

  test('an unreadable block does not turn a mined transaction into a failure', async () => {
    const { config } = setup({ minedAt: 24, unreadableBlocks: true });
    const pool: Record<string, Transaction> = {
      [OLD_HASH]: { txKey: OLD_HASH, chainId: sepolia.id, pending: true, from: SENDER } as unknown as Transaction,
    };
    void evmTrackerForStore({
      tx: pool[OLD_HASH],
      config,
      transactionsPool: pool,
      updateTxParams: (key, fields) => {
        pool[key] = { ...pool[key], ...fields } as Transaction;
      },
    });

    await pass(60);

    expect(pool[OLD_HASH].status).toBe(TransactionStatus.Success);
    expect(pool[OLD_HASH].finishedTimestamp).toEqual(expect.any(Number));
  });

  test('a throwing app callback does not turn a success into a failure', async () => {
    const { config } = setup({ minedAt: 24 });
    const pool: Record<string, Transaction> = {
      [OLD_HASH]: { txKey: OLD_HASH, chainId: sepolia.id, pending: true, from: SENDER } as unknown as Transaction,
    };
    const onSuccess = vi.fn(() => {
      throw new Error('app bug');
    });
    void evmTrackerForStore({
      tx: pool[OLD_HASH],
      config,
      transactionsPool: pool,
      updateTxParams: (key, fields) => {
        pool[key] = { ...pool[key], ...fields } as Transaction;
      },
      onSuccess,
    });

    await pass(60);

    expect(onSuccess).toHaveBeenCalledOnce();
    expect(pool[OLD_HASH].status).toBe(TransactionStatus.Success);
  });
});
