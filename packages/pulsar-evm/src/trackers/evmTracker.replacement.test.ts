/**
 * @file Runs the EVM tracker with the real viem against a scripted JSON-RPC node, with no mock of `viem/actions`.
 *
 * Every other tracker test mocks `waitForTransactionReceipt` and fires `onReplaced` by hand, so they stayed green while a
 * wallet's speed-up went unnoticed: viem forgets the transaction between two calls, and a node drops the old hash once
 * the replacement reaches it. Only a test on the real viem can see that. The times below are seconds from the start of
 * tracking; the windows of the default tracker are 0-60, 65-125, 135-195, 210-270, 290-350 and 375-435.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import {
  createPulsarStore,
  EvmTransaction,
  Transaction,
  TransactionStatus,
  TransactionTracker,
} from '@tuwaio/pulsar-core';
import { createConfig } from '@wagmi/core';
import { Address, createClient, custom, Hex, numberToHex, WaitForTransactionReceiptTimeoutError } from 'viem';
import { sepolia } from 'viem/chains';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createJSONStorage } from 'zustand/middleware';

import { pulsarEvmAdapter } from '../adapters/evmAdapter';
import { ConfirmationsTimeoutError, evmTracker, evmTrackerForStore } from './evmTracker';

const SENDER = '0xad9a211d227d2d9c1b5573f73cda0284b758ac0c' as Address;
const RECIPIENT = '0xb8d9b1ec1c1f8bea7fb10450198c0b47d50c96b7' as Address;
const OLD_HASH = `0x${'a'.repeat(64)}` as Hex;
const NEW_HASH = `0x${'b'.repeat(64)}` as Hex;
const NONCE = 1932;
const VALUE = 1000n;
const FIRST_BLOCK = 100_000;
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
  /** Whether a mined old transaction is still not returned by its hash, while its receipt is. */
  hideMinedByHash?: boolean;
  /** Until when, in seconds, reading the old transaction's receipt is an RPC error. */
  receiptFailsUntil?: number;
  /** Until when, in seconds, reading the old transaction by its hash is an RPC error. */
  lookupFailsUntil?: number;
  /** Reading these blocks by number fails once each, like a rate limit in the middle of a scan. */
  failBlocksOnce?: number[];
  /** When the mined transaction drops out with a reorganization. */
  reorgedAt?: number;
  /** When, after the reorganization, it is mined again. */
  minedAgainAt?: number;
  /** A contract creation: the transactions have no recipient. */
  contractCreation?: boolean;
  /** A node without old state, which answers the sender's count at the newest block only. */
  noOldState?: boolean;
};

const rpcTransaction = (fields: {
  hash: Hex;
  blockNumber: number | null;
  to?: Address | null;
  value?: bigint;
  input?: Hex;
  from?: Address;
}) => ({
  hash: fields.hash,
  from: fields.from ?? SENDER,
  to: fields.to === undefined ? RECIPIENT : fields.to,
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
  const againBlock = script.minedAgainAt === undefined ? null : blockAt(script.minedAgainAt);
  const reorgBlock = script.reorgedAt === undefined ? null : blockAt(script.reorgedAt);
  const failingBlocks = new Set(script.failBlocksOnce);
  const recipient = script.contractCreation ? { to: null } : {};
  const spentBlock = script.spentWithoutTransactionAt === undefined ? null : blockAt(script.spentWithoutTransactionAt);
  // A block has one content from the moment it exists, so everything is mined with the block its time falls in
  const reached = (block: number | null) => block !== null && blockAt(now()) >= block;
  const replacementMined = () => reached(replacementBlock);
  const ownMined = () => reached(ownBlock) && (!reached(reorgBlock) || reached(againBlock));
  const ownMinedIn = () => (reached(againBlock) ? (againBlock as number) : (ownBlock as number));
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
          return rpcTransaction({ hash: NEW_HASH, blockNumber: replacementBlock, ...recipient, ...script.replacement });
        }
        if (args[0] !== OLD_HASH) return null;
        if (now() < (script.lookupFailsUntil ?? -Infinity)) throw new Error('Internal JSON-RPC error.');
        if (ownMined()) {
          return script.hideMinedByHash ? null : rpcTransaction({ hash: OLD_HASH, blockNumber: ownMinedIn() });
        }
        if (replacementMined() || spent()) return null;
        return now() < (script.knownUntil ?? Infinity)
          ? rpcTransaction({ hash: OLD_HASH, blockNumber: null, ...recipient })
          : null;
      }
      case 'eth_getTransactionReceipt': {
        if (args[0] === OLD_HASH && now() < (script.receiptFailsUntil ?? -Infinity)) {
          throw new Error('Internal JSON-RPC error.');
        }
        if (args[0] === OLD_HASH && ownMined()) {
          return rpcReceipt(OLD_HASH, ownMinedIn(), script.receiptStatus ?? 'success');
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
      case 'eth_getTransactionCount': {
        const at = args[1] as string;
        if (script.noOldState && at !== 'latest') throw new Error('missing trie node');
        const block = at === 'latest' ? blockAt(now()) : Number(BigInt(at));
        const by = (mined: boolean, minedIn: number | null) => mined && minedIn !== null && block >= minedIn;
        const used =
          by(replacementMined(), replacementBlock) || by(spent(), spentBlock) || (ownMined() && block >= ownMinedIn());
        return numberToHex(NONCE + (used ? 1 : 0));
      }
      case 'eth_getTransactionBySenderAndNonce': {
        if (!script.slotMethod) throw Object.assign(new Error('the method does not exist'), { code: -32601 });
        if (replacementMined()) {
          return rpcTransaction({ hash: NEW_HASH, blockNumber: replacementBlock, ...script.replacement });
        }
        if (ownMined()) return rpcTransaction({ hash: OLD_HASH, blockNumber: ownMinedIn() });
        return null;
      }
      case 'eth_getBlockByNumber': {
        const asked = args[0] === 'latest' ? blockAt(now()) : Number(args[0]);
        if (failingBlocks.delete(asked)) throw new Error('Too many requests.');
        const transactions: unknown[] = [];
        if (asked === replacementBlock && replacementMined()) {
          transactions.push(
            rpcTransaction({ hash: NEW_HASH, blockNumber: asked, ...recipient, ...script.replacement }),
          );
        }
        if (ownMined() && asked === ownMinedIn()) {
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

  // Live on Sepolia, a fee below what public nodes keep: only the wallet's own RPC held `0xc8e3…`. No one learned its nonce, so
  // its speed-up in the wallet went unseen, and the toast of a transaction that had landed spun for as long as the tab was open
  describe('a hash only the connected wallet holds', () => {
    const walletOn = (chainId: number, request: (args: { method: string; params?: unknown }) => Promise<unknown>) => ({
      accounts: [SENDER] as readonly [Address],
      chainId,
      connector: { getProvider: async () => ({ request }) },
    });
    const holding = () =>
      vi.fn(async ({ method, params }: { method: string; params?: unknown }) => {
        expect(method).toBe('eth_getTransactionByHash');
        return (params as unknown[])[0] === OLD_HASH ? rpcTransaction({ hash: OLD_HASH, blockNumber: null }) : null;
      });
    function trackWith(script: Script, connection: ReturnType<typeof walletOn>) {
      const { config } = setup(script);
      config.setState((state) => ({
        ...state,
        connections: new Map([['wallet', connection]]) as never,
        current: 'wallet',
        status: 'connected',
      }));
      const callbacks = {
        onTxDetailsFetched: vi.fn(),
        onSuccess: vi.fn().mockResolvedValue(undefined),
        onFailure: vi.fn(),
        onReplaced: vi.fn(),
      };
      void evmTracker({ tx: { txKey: OLD_HASH, chainId: sepolia.id }, config, ...callbacks });
      return callbacks;
    }

    test('learns its nonce from the wallet and sees the speed-up', async () => {
      const tracker = trackWith({ knownUntil: 0, replacementMinedAt: 120 }, walletOn(sepolia.id, holding()));

      await pass(5);
      expect(tracker.onTxDetailsFetched).toHaveBeenCalledOnce();
      expect(tracker.onTxDetailsFetched.mock.calls[0][0]).toMatchObject({ hash: OLD_HASH, nonce: NONCE, from: SENDER });

      await pass(450);
      expect(tracker.onFailure).not.toHaveBeenCalled();
      expect(tracker.onReplaced).toHaveBeenCalledOnce();
      expect(tracker.onReplaced.mock.calls[0][0]).toMatchObject({ reason: 'repriced' });
      expect(tracker.onReplaced.mock.calls[0][0].transaction.hash).toBe(NEW_HASH);
    });

    test('asks nothing of the wallet while a node shows the hash', async () => {
      const wallet = holding();
      const tracker = trackWith({ knownUntil: 450, minedAt: 60 }, walletOn(sepolia.id, wallet));

      await pass(100);

      expect(wallet).not.toHaveBeenCalled();
      expect(tracker.onSuccess).toHaveBeenCalledOnce();
    });

    test('asks nothing of a wallet on another network: the hash means nothing there', async () => {
      const wallet = holding();
      const tracker = trackWith({ knownUntil: 0 }, walletOn(1, wallet));

      await pass(28);

      expect(wallet).not.toHaveBeenCalled();
      expect(tracker.onFailure).toHaveBeenCalledOnce();
    });

    test.each([
      ['says it has no such transaction', async () => null],
      [
        'fails',
        async () => {
          throw new Error('Unauthorized');
        },
      ],
    ])('ends as before when the wallet %s', async (_name, answer) => {
      const tracker = trackWith({ knownUntil: 0 }, walletOn(sepolia.id, vi.fn(answer)));

      await pass(26);
      expect(tracker.onFailure).not.toHaveBeenCalled();
      await pass(2);
      expect(tracker.onFailure).toHaveBeenCalledOnce();
      expect(tracker.onTxDetailsFetched).not.toHaveBeenCalled();
    });

    test('is not held up by a wallet that never answers', async () => {
      const tracker = trackWith(
        { knownUntil: 0 },
        walletOn(
          sepolia.id,
          vi.fn(() => new Promise(() => {})),
        ),
      );

      await pass(70);

      expect(tracker.onFailure).toHaveBeenCalledOnce();
    });

    test('goes by what a node shows once it does', async () => {
      const wallet = vi.fn(async () => null);
      const tracker = trackWith({ knownUntil: 450, minedAt: 60 }, walletOn(sepolia.id, wallet));

      await pass(100);

      expect(tracker.onTxDetailsFetched).toHaveBeenCalledOnce();
      expect(tracker.onSuccess).toHaveBeenCalledOnce();
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

  describe('what the review of this tracker found', () => {
    const knownDetails = { from: SENDER, nonce: NONCE, to: RECIPIENT, value: VALUE, input: '0x' as Hex };

    test('an RPC error on the receipt is no answer: a mined transaction does not end as replaced', async () => {
      // Mined beyond the scan, so nothing can be found for the spent nonce while its receipt cannot be read
      const tracker = track({ minedAt: -60_000, knownUntil: 0, receiptFailsUntil: 300 }, { knownDetails });

      await pass(600);

      expect(tracker.onFailure).not.toHaveBeenCalled();
      expect(tracker.onReplaced).not.toHaveBeenCalled();
      expect(tracker.onSuccess).toHaveBeenCalledOnce();
    });

    test('a transaction seen in a block is not reported as spent, whatever a node says of its receipt', async () => {
      const tracker = track({ minedAt: -60_000, receiptFailsUntil: 10_000 });

      await pass(434);

      expect(tracker.onReplaced).not.toHaveBeenCalled();
      expect((tracker.onFailure.mock.calls[0]?.[0] as Error | undefined)?.name).not.toBe('NonceSlotSpentError');
    });

    test('a receipt found by the nonce reading finishes tracking, also after the last window', async () => {
      // Five windows, the last one ending at 350 s. Mined in the block of second 348, after viem's last look
      const tracker = track({ minedAt: 348 }, { receiptAttempts: 5 });

      await pass(360);

      expect(tracker.onSuccess).toHaveBeenCalledOnce();
      expect(tracker.onFailure).not.toHaveBeenCalled();
    });

    test('two trackers of one hash both get the result: the second must not silence the first', async () => {
      const { config } = setup({ minedAt: 204 });
      const first = { onSuccess: vi.fn().mockResolvedValue(undefined), onFailure: vi.fn() };
      const second = { onSuccess: vi.fn().mockResolvedValue(undefined), onFailure: vi.fn() };
      const start = (callbacks: typeof first) =>
        void evmTracker({
          tx: { txKey: OLD_HASH, chainId: sepolia.id },
          config,
          onTxDetailsFetched: vi.fn(),
          onReplaced: vi.fn(),
          waitForTransactionReceiptParams: { hash: OLD_HASH, timeout: 180_000 },
          ...callbacks,
        });

      start(first);
      await pass(100);
      start(second);
      await pass(1300);

      expect(first.onSuccess).toHaveBeenCalledOnce();
      expect(second.onSuccess).toHaveBeenCalledOnce();
      expect(first.onFailure).not.toHaveBeenCalled();
      expect(second.onFailure).not.toHaveBeenCalled();
    });

    test('a receipt without details is still a success: the node may never show the hash', async () => {
      const tracker = track({ minedAt: 24, knownUntil: 0, hideMinedByHash: true }, { knownDetails });

      await pass(180);

      expect(tracker.onFailure).not.toHaveBeenCalled();
      expect(tracker.onSuccess).toHaveBeenCalledOnce();
      const details = tracker.onSuccess.mock.calls[0][0];
      expect(details.hash).toBe(OLD_HASH);
      expect(details.from).toBe(SENDER);
      expect(details.nonce).toBe(NONCE);
    });

    test('a limit on the confirmations is an option: without it a mined transaction waits as it did', async () => {
      const { config } = setup({ minedAt: 12 });
      const onFailure = vi.fn();
      void evmTracker({
        tx: { txKey: OLD_HASH, chainId: sepolia.id, requiredConfirmations: 1_000_000 },
        config,
        onTxDetailsFetched: vi.fn(),
        onSuccess: vi.fn(),
        onFailure,
        onReplaced: vi.fn(),
      });

      await pass(2000);

      expect(onFailure).not.toHaveBeenCalled();
    });

    test('with the limit a server gets the receipt and the reason', async () => {
      const { config } = setup({ minedAt: 12 });
      const onFailure = vi.fn();
      void evmTracker({
        tx: { txKey: OLD_HASH, chainId: sepolia.id, requiredConfirmations: 1_000_000 },
        config,
        confirmationsTimeout: 300_000,
        onTxDetailsFetched: vi.fn(),
        onSuccess: vi.fn(),
        onFailure,
        onReplaced: vi.fn(),
      });

      await pass(320);

      expect(onFailure).toHaveBeenCalledOnce();
      expect(onFailure.mock.calls[0][0]).toBeInstanceOf(ConfirmationsTimeoutError);
      expect(onFailure.mock.calls[0][0].receipt.transactionHash).toBe(OLD_HASH);
    });

    test('a store tracker started by hand on a transaction the store never tracked goes on', async () => {
      const { config } = setup({ minedAt: 24 });
      const tx = {
        txKey: OLD_HASH,
        chainId: sepolia.id,
        pending: true,
        from: SENDER,
        localTimestamp: Math.floor(Date.now() / 1000),
      } as unknown as Transaction;
      const pool: Record<string, Transaction> = { [OLD_HASH]: tx };
      void evmTrackerForStore({
        tx,
        config,
        transactionsPool: pool,
        updateTxParams: (key, fields) => {
          pool[key] = { ...pool[key], ...fields } as Transaction;
          return pool[key];
        },
        isTxTracked: () => false,
      });

      await pass(120);

      expect(pool[OLD_HASH].status).toBe(TransactionStatus.Success);
    });

    test('a receipt a reorganization dropped goes back to waiting and is not reported as final', async () => {
      const { config } = setup({ minedAt: 12, reorgedAt: 24, minedAgainAt: 300 });
      const onSuccess = vi.fn().mockResolvedValue(undefined);
      void evmTracker({
        tx: { txKey: OLD_HASH, chainId: sepolia.id, requiredConfirmations: 3 },
        config,
        onTxDetailsFetched: vi.fn(),
        onSuccess,
        onFailure: vi.fn(),
        onReplaced: vi.fn(),
      });

      await pass(200);
      expect(onSuccess).not.toHaveBeenCalled();

      await pass(250);
      expect(onSuccess).toHaveBeenCalledOnce();
      expect(onSuccess.mock.calls[0][1].blockNumber).toBe(BigInt(blockAt(300)));
    });

    test('the block scan goes on where it stopped, and reads a block once', async () => {
      // Mined 100 blocks before the restart, and a rate limit stops the scan halfway
      const tracker = track(
        { knownUntil: 0, replacementMinedAt: -1200, failBlocksOnce: [FIRST_BLOCK - 50], noOldState: true },
        { knownDetails },
      );

      await pass(120);

      expect(tracker.onReplaced).toHaveBeenCalledOnce();
      const reads = tracker.node.calls.filter((method) => method === 'eth_getBlockByNumber').length;
      expect(reads).toBeLessThan(130);
    });

    // Every block since, for each replaced transaction on each wallet and server tracking one: a paid RPC bills them, and a
    // public one stops answering
    test('a node with old state reads the one block that spent the nonce', async () => {
      const scan = track({ knownUntil: 0, replacementMinedAt: -1200, noOldState: true }, { knownDetails });
      await pass(120);
      const tracker = track({ knownUntil: 0, replacementMinedAt: -1200 }, { knownDetails });
      await pass(120);

      expect(tracker.onReplaced).toHaveBeenCalledOnce();
      expect(tracker.onReplaced.mock.calls[0][0].transaction.hash).toBe(NEW_HASH);
      const fullBlocks = (node: typeof tracker.node) =>
        node.calls.filter((method) => method === 'eth_getBlockByNumber').length;
      expect(fullBlocks(scan.node)).toBeGreaterThan(90);
      expect(fullBlocks(tracker.node)).toBeLessThan(10);
    });

    test('the first block of the scan is read before the first lookup, with a margin', async () => {
      const tracker = track({ knownUntil: 40, replacementMinedAt: 48 });

      await pass(1);

      expect(tracker.node.calls.indexOf('eth_blockNumber')).toBeLessThan(
        tracker.node.calls.indexOf('eth_getTransactionByHash'),
      );
    });

    test('a sped-up contract creation is a speed-up', async () => {
      const tracker = track(
        { knownUntil: 0, replacementMinedAt: -60, contractCreation: true },
        { knownDetails: { ...knownDetails, to: null } },
      );

      await pass(60);

      expect(tracker.onReplaced.mock.calls[0][0].reason).toBe('repriced');
    });

    test('a throwing onFailure is not run twice', async () => {
      const onFailure = vi.fn().mockRejectedValue(new Error('database down'));
      const { config } = setup({ knownUntil: 0, spentWithoutTransactionAt: -60 });
      const finished = evmTracker({
        tx: { txKey: OLD_HASH, chainId: sepolia.id },
        config,
        knownDetails,
        onTxDetailsFetched: vi.fn(),
        onSuccess: vi.fn(),
        onFailure,
        onReplaced: vi.fn(),
      }).catch(() => 'rejected');

      await pass(450);

      expect(onFailure).toHaveBeenCalledOnce();
      await expect(finished).resolves.toBe('rejected');
    });

    test('a throwing onTxDetailsFetched leaves the sender and nonce known', async () => {
      const tracker = track(
        { knownUntil: 60, replacementMinedAt: 72 },
        {
          onTxDetailsFetched: () => {
            throw new Error('app bug');
          },
        },
      );

      await pass(200);

      expect(tracker.onReplaced).toHaveBeenCalledOnce();
    });

    test('a rejecting onConfirmationsUpdate is caught and the count goes on', async () => {
      const { config } = setup({ minedAt: 12 });
      const onSuccess = vi.fn().mockResolvedValue(undefined);
      void evmTracker({
        tx: { txKey: OLD_HASH, chainId: sepolia.id, requiredConfirmations: 3 },
        config,
        onTxDetailsFetched: vi.fn(),
        onSuccess,
        onFailure: vi.fn(),
        onReplaced: vi.fn(),
        onConfirmationsUpdate: () => Promise.reject(new Error('redis down')),
      });

      await pass(400);

      expect(console.warn).toHaveBeenCalled();
    });

    test('an abandoned transaction stops its tracker with no callback', async () => {
      let abandoned = false;
      const tracker = track({}, { isAbandoned: () => abandoned });

      await pass(70);
      abandoned = true;
      await pass(100);
      const calls = tracker.node.calls.length;
      await pass(600);

      expect(tracker.node.calls.length).toBe(calls);
      expect(tracker.onFailure).not.toHaveBeenCalled();
    });

    test('logs carry only the name of an error: viem quotes the RPC URL with its key in the message', async () => {
      track({}, { receiptAttempts: 2 });

      await pass(200);

      const logged = vi.mocked(console.warn).mock.calls.flat();
      expect(logged.length).toBeGreaterThan(0);
      expect(logged.every((part) => typeof part === 'string')).toBe(true);
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

    test('a replacement is reported at once: what follows it waits for the confirmations, not the report', async () => {
      const { config } = setup({ knownUntil: 40, replacementMinedAt: 48 });
      const onReplaced = vi.fn();
      void evmTracker({
        tx: { txKey: OLD_HASH, chainId: sepolia.id, requiredConfirmations: 12 },
        config,
        onTxDetailsFetched: vi.fn(),
        onSuccess: vi.fn(),
        onFailure: vi.fn(),
        onReplaced,
      });

      await pass(60);

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

  test('another transaction in the nonce that reverted is an error, as nothing follows it', async () => {
    const store = trackInStore({
      knownUntil: 100,
      replacementMinedAt: 108,
      receiptStatus: 'reverted',
      replacement: { to: SENDER, value: 5n },
    });

    await pass(300);

    expect(store.current().status).toBe(TransactionStatus.Replaced);
    expect(store.current().isError).toBe(true);
    expect(store.onError).toHaveBeenCalledOnce();
  });

  test('a speed-up that reverted is not an error of the replaced record: the new record reports it', async () => {
    const store = trackInStore({ knownUntil: 100, replacementMinedAt: 108, receiptStatus: 'reverted' });

    await pass(300);

    expect(store.current().status).toBe(TransactionStatus.Replaced);
    expect(store.current().isError).toBe(false);
    expect(store.onError).not.toHaveBeenCalled();
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

  test('an RPC error past the day is no answer: only a node saying it has no such hash ends the wait', async () => {
    const dayAgo = Math.floor(Date.now() / 1000) - 25 * 3600;
    const store = trackInStore({ minedAt: 200, lookupFailsUntil: 250 }, { localTimestamp: String(dayAgo) });

    await pass(240);
    expect(store.current().pending).toBe(true);
    expect(store.current().status).toBeUndefined();

    await pass(120);
    expect(store.current().status).toBe(TransactionStatus.Success);
  });

  test('a mined transaction keeps its record: finishing never removes it from the pool', async () => {
    const store = trackInStore({ minedAt: 24 });

    await pass(60);

    expect(store.current().status).toBe(TransactionStatus.Success);
    expect(store.pool[OLD_HASH]).toBeDefined();
  });

  test('callbacks do not say what the store refused: the pool keeps its final result', async () => {
    const { config } = setup({ minedAt: 24 });
    const tx = {
      txKey: OLD_HASH,
      chainId: sepolia.id,
      pending: true,
      from: SENDER,
      localTimestamp: Math.floor(Date.now() / 1000),
    } as unknown as Transaction;
    const onSuccess = vi.fn();
    void evmTrackerForStore({
      tx,
      config,
      transactionsPool: { [OLD_HASH]: tx },
      // Another tab has already written another result
      updateTxParams: () => ({ ...tx, status: TransactionStatus.Replaced, pending: false }) as Transaction,
      onSuccess,
    });

    await pass(60);

    expect(onSuccess).not.toHaveBeenCalled();
  });

  test('a transaction the store no longer tracks stops its tracker', async () => {
    const { config, node } = setup({});
    const tx = {
      txKey: OLD_HASH,
      chainId: sepolia.id,
      pending: true,
      from: SENDER,
      localTimestamp: Math.floor(Date.now() / 1000),
    } as unknown as Transaction;
    let tracked = true;
    void evmTrackerForStore({
      tx,
      config,
      transactionsPool: { [OLD_HASH]: tx },
      updateTxParams: () => undefined,
      isTxTracked: () => tracked,
    });

    await pass(70);
    tracked = false;
    await pass(100);
    const calls = node.calls.length;
    await pass(600);

    expect(node.calls.length).toBe(calls);
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

describe('a speed-up through the real store, adapter and viem', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function storeOn(script: Script) {
    const { config } = setup(script);
    const saved = new Map<string, string>();
    const store = createPulsarStore<EvmTransaction>({
      name: 'real-viem',
      // The block times of the scripted node are from 2023
      retentionDays: null,
      adapter: pulsarEvmAdapter<EvmTransaction>(config, [sepolia]),
      storage: createJSONStorage(() => ({
        getItem: (key) => saved.get(key) ?? null,
        setItem: (key, value) => void saved.set(key, value),
        removeItem: (key) => void saved.delete(key),
      })),
    });
    return store;
  }

  const sent = {
    txKey: OLD_HASH,
    adapter: OrbitAdapter.EVM,
    tracker: TransactionTracker.Ethereum,
    chainId: sepolia.id,
    from: SENDER,
    type: 'REFUND',
    title: 'Refund',
    localTimestamp: 1_700_000_000,
    connectorType: 'evm:metamask',
  } as unknown as EvmTransaction;

  test('the old record ends as Replaced, and the new one goes on to its own result', async () => {
    const store = storeOn({ knownUntil: 120, replacementMinedAt: 132 });
    await store.getState().addTxToPool(sent);
    await store.getState().initializeTransactionsPool();

    await pass(300);

    const pool = store.getState().transactionsPool as Record<string, EvmTransaction>;
    expect(pool[OLD_HASH].status).toBe(TransactionStatus.Replaced);
    expect(pool[OLD_HASH].replacedTxHash).toBe(NEW_HASH);
    expect(pool[NEW_HASH].status).toBe(TransactionStatus.Success);
    expect(pool[NEW_HASH].replaces).toBe(OLD_HASH);
    expect(pool[NEW_HASH].title).toBe('Refund');
    expect(pool[NEW_HASH].pending).toBe(false);
  });

  test('a speed-up that reverted ends the new record as Failed', async () => {
    const store = storeOn({ knownUntil: 120, replacementMinedAt: 132, receiptStatus: 'reverted' });
    await store.getState().addTxToPool(sent);
    await store.getState().initializeTransactionsPool();

    await pass(300);

    const pool = store.getState().transactionsPool as Record<string, EvmTransaction>;
    expect(pool[OLD_HASH].status).toBe(TransactionStatus.Replaced);
    expect(pool[NEW_HASH].status).toBe(TransactionStatus.Failed);
    expect(pool[NEW_HASH].isError).toBe(true);
  });

  test('the new record waits for the confirmations the operation asked for', async () => {
    const store = storeOn({ knownUntil: 120, replacementMinedAt: 132 });
    await store.getState().addTxToPool({ ...sent, requiredConfirmations: 3 });
    await store.getState().initializeTransactionsPool();

    // Mined at 132 s, its third confirmation is the block of second 156
    await pass(145);
    const pool = () => store.getState().transactionsPool as Record<string, EvmTransaction>;
    expect(pool()[OLD_HASH].status).toBe(TransactionStatus.Replaced);
    expect(pool()[NEW_HASH].pending).toBe(true);

    await pass(100);
    expect(pool()[NEW_HASH].status).toBe(TransactionStatus.Success);
  });

  test('a cancel adds no record', async () => {
    const store = storeOn({ knownUntil: 120, replacementMinedAt: 132, replacement: { to: SENDER, value: 0n } });
    await store.getState().addTxToPool(sent);
    await store.getState().initializeTransactionsPool();

    await pass(300);

    const pool = store.getState().transactionsPool as Record<string, EvmTransaction>;
    expect(pool[OLD_HASH].replacedReason).toBe('cancelled');
    expect(pool[NEW_HASH]).toBeUndefined();
  });
});
