/**
 * @file Unit tests for the EIP-5792 call batch tracker.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import {
  EvmTransaction,
  initializePollingTracker,
  ITxTrackingStore,
  TrackerCallbacks,
  TransactionStatus,
  TransactionTracker,
} from '@tuwaio/pulsar-core';
import { Config, getCallsStatus } from '@wagmi/core';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { createEip5792Fetcher, Eip5792FetchResult, eip5792Tracker, eip5792TrackerForStore } from './eip5792Tracker';
import { evmTracker } from './evmTracker';

vi.mock('@tuwaio/pulsar-core', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/pulsar-core')>();
  return { ...original, initializePollingTracker: vi.fn() };
});
vi.mock('@wagmi/core', async (importActual) => {
  const original = await importActual<typeof import('@wagmi/core')>();
  return { ...original, getCallsStatus: vi.fn() };
});
vi.mock('./evmTracker', () => ({ evmTracker: vi.fn() }));
vi.mock('viem/actions', () => ({ getBlock: vi.fn().mockResolvedValue({ timestamp: 1700000042n }) }));

const BATCH_ID = '0x00000000000000000000000000000000000000000000000000000000000014a3';
const TX_HASH = '0xa4a48b18bb9a79aa05c6049e4faaf707d905c44740c564aefe59ff1f243d04e9';
const config = {} as Config;
const receipt = (status: 'success' | 'reverted', transactionHash = TX_HASH) => ({
  logs: [],
  status,
  blockHash: '0x01',
  blockNumber: 1n,
  gasUsed: 1n,
  transactionHash,
});
const callsStatus = (fields: Record<string, unknown>) =>
  vi
    .mocked(getCallsStatus)
    .mockResolvedValueOnce({ id: BATCH_ID, version: '2.0.0', atomic: true, chainId: 84532, ...fields } as never);

describe('eip5792Tracker', () => {
  let tx: EvmTransaction;
  const fetch = async () => {
    const callbacks = { stopPolling: vi.fn(), onSuccess: vi.fn(), onFailure: vi.fn(), onIntervalTick: vi.fn() };
    await createEip5792Fetcher(config)({ tx, ...callbacks });
    return callbacks;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    tx = {
      txKey: BATCH_ID,
      chainId: 84532,
      from: '0x0000000000000000000000000000000000000001',
      type: 'PAYMENT',
      connectorType: 'evm:coinbase',
      tracker: TransactionTracker.EIP5792,
      pending: true,
      adapter: OrbitAdapter.EVM,
      localTimestamp: 1700000000,
      requiredConfirmations: 1,
    };
  });

  describe('fetcher', () => {
    test('asks the wallet for the batch status and waits while it is pending', async () => {
      callsStatus({ status: 'pending', statusCode: 100 });
      const { stopPolling, onIntervalTick, onSuccess, onFailure } = await fetch();
      expect(getCallsStatus).toHaveBeenCalledWith(config, { id: BATCH_ID });
      expect(onIntervalTick).toHaveBeenCalledWith({ status: 'pending', statusCode: 100 });
      expect(stopPolling).not.toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).not.toHaveBeenCalled();
    });

    test('reports the hash of the transaction that executed the batch', async () => {
      callsStatus({ status: 'success', statusCode: 200, receipts: [receipt('success', '0x01'), receipt('success')] });
      const { stopPolling, onSuccess } = await fetch();
      expect(stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
      expect(onSuccess).toHaveBeenCalledWith({ status: 'success', statusCode: 200, hash: TX_HASH });
    });

    test('fails a batch whose calls reverted, with the hash, and one the wallet never sent, without one', async () => {
      callsStatus({ status: 'failure', statusCode: 500, receipts: [receipt('reverted')] });
      const reverted = await fetch();
      expect(reverted.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
      expect(reverted.onFailure).toHaveBeenCalledWith({
        status: 'failed',
        statusCode: 500,
        hash: TX_HASH,
        reason: 'The calls reverted on-chain.',
      });

      callsStatus({ status: 'failure', statusCode: 400 });
      const offchain = await fetch();
      expect(offchain.onFailure).toHaveBeenCalledWith({
        status: 'failed',
        statusCode: 400,
        reason: 'The wallet did not send the calls.',
      });
    });

    test('fails a batch the wallet reports as sent whose receipt reverted', async () => {
      callsStatus({ status: 'success', statusCode: 200, receipts: [receipt('reverted')] });
      const { onFailure, onSuccess } = await fetch();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onFailure).toHaveBeenCalledWith(expect.objectContaining({ status: 'failed', hash: TX_HASH }));
    });

    test('rethrows when the wallet cannot be asked, so the polling tracker counts a failed attempt', async () => {
      vi.mocked(getCallsStatus).mockRejectedValueOnce(new Error('Connector not connected.'));
      await expect(fetch()).rejects.toThrow('Connector not connected.');
    });
  });

  test('standalone: polls the wallet every 2 seconds', () => {
    eip5792Tracker({ tx, config, onSuccess: vi.fn(), onFailure: vi.fn() });
    expect(initializePollingTracker).toHaveBeenCalledWith(
      expect.objectContaining({ tx, pollingInterval: 2000, maxRetries: 60, fetcher: expect.any(Function) }),
    );
  });

  describe('for the store', () => {
    let params: Pick<ITxTrackingStore<EvmTransaction>, 'updateTxParams' | 'removeTxFromPool' | 'transactionsPool'> & {
      tx: EvmTransaction;
      config: Config;
    } & TrackerCallbacks<EvmTransaction>;

    beforeEach(() => {
      params = {
        tx,
        config,
        transactionsPool: { [tx.txKey]: tx },
        updateTxParams: vi.fn(),
        removeTxFromPool: vi.fn(),
        onSuccess: vi.fn(),
        onError: vi.fn(),
        onReplaced: vi.fn(),
      };
    });

    test('writes the hash once the batch is sent, then follows the transaction on-chain', async () => {
      await eip5792TrackerForStore(params);
      const polling = vi.mocked(initializePollingTracker).mock.calls[0][0] as unknown as {
        onSuccess: (result: Eip5792FetchResult) => Promise<void>;
      };
      await polling.onSuccess({ status: 'success', statusCode: 200, hash: TX_HASH });

      expect(params.updateTxParams).toHaveBeenCalledWith(BATCH_ID, { hash: TX_HASH });
      expect(evmTracker).toHaveBeenCalledWith(
        expect.objectContaining({ tx: { chainId: 84532, txKey: TX_HASH, requiredConfirmations: 1 }, config }),
      );
      const stage2 = vi.mocked(evmTracker).mock.calls[0][0];
      await stage2.onSuccess({} as never, { status: 'success', blockNumber: 1n } as never, {} as never);
      expect(params.updateTxParams).toHaveBeenCalledWith(BATCH_ID, {
        status: TransactionStatus.Success,
        pending: false,
        isError: false,
        hash: TX_HASH,
        finishedTimestamp: 1700000042,
      });
      expect(params.onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ hash: TX_HASH, status: TransactionStatus.Success }),
      );
    });

    test('resumes on-chain when the hash is already known (after a reload)', async () => {
      await eip5792TrackerForStore({ ...params, tx: { ...tx, hash: TX_HASH } });
      expect(initializePollingTracker).not.toHaveBeenCalled();
      expect(evmTracker).toHaveBeenCalledWith(
        expect.objectContaining({ tx: { chainId: 84532, txKey: TX_HASH, requiredConfirmations: 1 } }),
      );
    });

    test('marks the transaction failed with the reason, and keeps it in the pool', async () => {
      await eip5792TrackerForStore(params);
      const polling = vi.mocked(initializePollingTracker).mock.calls[0][0] as unknown as {
        onFailure: (result?: Eip5792FetchResult) => void;
        removeTxFromPool?: unknown;
      };
      expect(polling.removeTxFromPool).toBeUndefined();
      polling.onFailure({ status: 'failed', statusCode: 400, reason: 'The wallet did not send the calls.' });
      expect(params.updateTxParams).toHaveBeenCalledWith(
        BATCH_ID,
        expect.objectContaining({
          status: TransactionStatus.Failed,
          pending: false,
          isError: true,
          error: expect.objectContaining({ message: 'The wallet did not send the calls.' }),
        }),
      );
      expect(params.onError).toHaveBeenCalled();
      expect(params.removeTxFromPool).not.toHaveBeenCalled();
    });
  });
});
