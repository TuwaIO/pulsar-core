import { describe, expect, it } from 'vitest';

import { EvmTransaction, TransactionPool, TransactionStatus } from '../types';
import { keepsItsResult, mergeTabPools } from './mergeTabPools';

const tx = (txKey: string, fields: Partial<EvmTransaction> = {}) =>
  ({ txKey, pending: true, ...fields }) as unknown as EvmTransaction;
const done = (txKey: string, status: TransactionStatus) => tx(txKey, { status, pending: false });
const pool = (...txs: EvmTransaction[]) =>
  Object.fromEntries(txs.map((t) => [t.txKey, t])) as TransactionPool<EvmTransaction>;

describe('keepsItsResult', () => {
  it.each([
    [TransactionStatus.Success, TransactionStatus.Failed, true],
    [TransactionStatus.Replaced, TransactionStatus.Failed, true],
    [TransactionStatus.Success, TransactionStatus.Replaced, true],
    [TransactionStatus.Failed, TransactionStatus.Success, false],
    [TransactionStatus.Failed, TransactionStatus.Replaced, false],
    [TransactionStatus.Failed, undefined, true],
    [undefined, TransactionStatus.Failed, false],
  ])('%s against %s', (current, next, kept) => {
    expect(keepsItsResult(current, next)).toBe(kept);
  });
});

describe('mergeTabPools', () => {
  it('a result of the other tab does not close the tracking modal of this one', () => {
    const current = pool(tx('a', { isTrackedModalOpen: true }));
    const saved = pool({ ...done('a', TransactionStatus.Replaced), isTrackedModalOpen: false });

    const merged = mergeTabPools(current, saved).pool.a;

    expect(merged.status).toBe(TransactionStatus.Replaced);
    expect(merged.isTrackedModalOpen).toBe(true);
  });

  it('keeps a pending transaction the other tab has not saved yet', () => {
    const current = pool(tx('mine'));
    expect(mergeTabPools(current, pool()).pool).toBe(current);
  });

  it('never takes a final status back to pending', () => {
    const current = pool(done('a', TransactionStatus.Success));
    const { pool: merged, finished } = mergeTabPools(current, pool(tx('a')));
    expect(merged.a.status).toBe(TransactionStatus.Success);
    expect(finished).toEqual([]);
  });

  it('takes the final result of the other tab, and says it has just finished here', () => {
    const { pool: merged, finished } = mergeTabPools(pool(tx('a')), pool(done('a', TransactionStatus.Replaced)));
    expect(merged.a.status).toBe(TransactionStatus.Replaced);
    expect(finished).toEqual(['a']);
  });

  it('takes the answer of the chain over a Failed', () => {
    const { pool: merged, finished } = mergeTabPools(
      pool(done('a', TransactionStatus.Failed)),
      pool(done('a', TransactionStatus.Success)),
    );
    expect(merged.a.status).toBe(TransactionStatus.Success);
    expect(finished).toEqual(['a']);
  });

  it('does not take a Failed over the answer of the chain', () => {
    const { pool: merged } = mergeTabPools(
      pool(done('a', TransactionStatus.Success)),
      pool(done('a', TransactionStatus.Failed)),
    );
    expect(merged.a.status).toBe(TransactionStatus.Success);
  });

  it('adds what only the other tab knows, and names the pending ones so this tab can track them', () => {
    const { pool: merged, added } = mergeTabPools(pool(), pool(tx('a'), done('b', TransactionStatus.Success)));
    expect(Object.keys(merged)).toEqual(['a', 'b']);
    expect(added.map((t) => t.txKey)).toEqual(['a']);
  });

  it('learns the fields only the other tab has, keeping its own values', () => {
    const { pool: merged } = mergeTabPools(pool(tx('a', { to: '0x1' })), pool(tx('a', { to: '0x2', nonce: 7 })));
    expect((merged.a as EvmTransaction).nonce).toBe(7);
    expect((merged.a as EvmTransaction).to).toBe('0x1');
  });

  it('changes nothing when there is nothing to learn, which ends the exchange between two tabs', () => {
    const current = pool(tx('a', { to: '0x1', nonce: 7 }), done('b', TransactionStatus.Success));
    const saved = pool(tx('a', { to: '0x2' }), done('b', TransactionStatus.Success));
    const result = mergeTabPools(current, saved);
    expect(result.pool).toBe(current);
    expect(result.finished).toEqual([]);
    expect(result.added).toEqual([]);
  });
});
