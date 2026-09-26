import { OrbitAdapter } from '@tuwaio/orbit-core';
import { describe, expect, it, vi } from 'vitest';

import { EvmTransaction, TransactionStatus, TransactionTracker } from '../types';
import { createTxUpdater } from './createTxUpdater';

const tx: EvmTransaction = {
  adapter: OrbitAdapter.EVM,
  chainId: 1,
  connectorType: 'injected',
  from: '0x0000000000000000000000000000000000000001',
  localTimestamp: 1,
  pending: true,
  tracker: TransactionTracker.Ethereum,
  txKey: '0x1',
  type: 'SWAP',
};

describe('createTxUpdater', () => {
  it('writes every update to the store and returns the transaction with all updates applied', () => {
    const updateTxParams = vi.fn();
    const updateTx = createTxUpdater({ tx, transactionsPool: { [tx.txKey]: tx }, updateTxParams });

    updateTx({ nonce: 7 });
    const updatedTx = updateTx({ status: TransactionStatus.Success, pending: false });

    expect(updateTxParams).toHaveBeenNthCalledWith(1, '0x1', { nonce: 7 });
    expect(updateTxParams).toHaveBeenNthCalledWith(2, '0x1', { status: TransactionStatus.Success, pending: false });
    expect(updatedTx).toEqual({ ...tx, nonce: 7, status: TransactionStatus.Success, pending: false });
  });

  it('does not mutate the pool snapshot', () => {
    const pool = { [tx.txKey]: tx };
    const updateTx = createTxUpdater({ tx, transactionsPool: pool, updateTxParams: vi.fn() });

    updateTx({ pending: false });

    expect(pool[tx.txKey]).toBe(tx);
    expect(tx.pending).toBe(true);
  });

  it('returns undefined when the transaction was not in the pool, but still writes the update', () => {
    const updateTxParams = vi.fn();
    const updateTx = createTxUpdater({ tx, transactionsPool: {}, updateTxParams });

    expect(updateTx({ pending: false })).toBeUndefined();
    expect(updateTxParams).toHaveBeenCalledWith('0x1', { pending: false });
  });
});
