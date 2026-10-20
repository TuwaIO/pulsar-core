/**
 * @file The core Zustand slice of the transaction store: the transaction pool and the actions that add, update and
 * remove transactions and synchronize them with a remote backend.
 */

import { produce } from 'immer';

import { IInitializeTxTrackingStore, PulsarAdapter, StoreSlice, Transaction, TransactionPool } from '../types';
import { DEFAULT_RETENTION_DAYS, expiredTransactionKeys } from '../utils/transactionRetention';
import { validateTransaction } from '../utils/transactionValidation';
import { isFinishedStatus } from '../utils/txFinished';

/**
 * Returns a copy of a transaction without the API keys that the client needs to resume tracking but a backend must
 * not receive (`pimlicoApiKey`, `gelatoApiKey`).
 *
 * @param tx - The transaction.
 * @returns A shallow copy without the API keys.
 */
function omitClientSecrets<T extends Transaction>(tx: T): T {
  const remoteTx: T & { pimlicoApiKey?: string; gelatoApiKey?: string } = { ...tx };
  delete remoteTx.pimlicoApiKey;
  delete remoteTx.gelatoApiKey;
  return remoteTx;
}

/**
 * Creates the core slice of the transaction store: `transactionsPool`, `initialTx`, `unsyncedTxKeys` and the actions
 * that change them. `createPulsarStore` uses it; call it directly only to compose a custom Zustand store.
 *
 * The slice keeps its state in memory; persistence is added by the store that uses it.
 *
 * @template T - The application transaction type.
 * @param params - The slice options.
 * @param params.maxTransactions - Maximum number of transactions in the pool; `addTxToPool` evicts the oldest
 * finished ones (by `localTimestamp`) to stay within it. Pending transactions are never evicted, so the pool can hold
 * more while they are pending.
 * @param params.retentionDays - Days a finished transaction stays in the pool; `addTxToPool` drops the expired ones
 * first. `null` keeps them without a term. Defaults to 30.
 * @param params.onRemoteCreate - Optional remote sync callback, called in the background by `addTxToPool` (see
 * `SyncCallbacks`).
 * @param params.onTxFinished - Called by `updateTxParams` once when it moves a transaction from a non-final to a final
 * status (see `TxFinishedListener`). `createPulsarStore` passes a function that runs its `onTxFinished` option and the
 * listeners of `subscribeTxFinished`; it must not throw.
 * @returns A slice creator for Zustand's `create` / `createStore`.
 */
export function initializeTxTrackingStore<T extends Transaction>({
  maxTransactions,
  retentionDays = DEFAULT_RETENTION_DAYS,
  onRemoteCreate,
  onTxFinished,
}: Pick<PulsarAdapter<T>, 'onRemoteCreate' | 'retentionDays' | 'onTxFinished'> & {
  maxTransactions: number;
}): StoreSlice<IInitializeTxTrackingStore<T>> {
  let isReconciling = false;
  // Keys whose `onRemoteCreate` call is in flight, so a reconciliation run does not send them twice.
  const syncingTxKeys = new Set<string>();

  return (set, get) => {
    /**
     * Sends a pooled transaction to `onRemoteCreate` and marks it synced on success. Failures are logged and the
     * key stays in `unsyncedTxKeys`. Does nothing if the transaction is not in the pool or is already being sent.
     */
    const syncTransaction = async (txKey: string, failureMessage: string) => {
      const tx = get().transactionsPool[txKey];
      if (!onRemoteCreate || !tx || syncingTxKeys.has(txKey)) return;

      syncingTxKeys.add(txKey);
      try {
        await onRemoteCreate(omitClientSecrets(tx));
        set((s) =>
          produce(s, (draft) => {
            const draftTx = draft.transactionsPool[txKey];
            if (draftTx) {
              draftTx.syncStatus = 'synced';
            }
            if (draft.unsyncedTxKeys) {
              delete draft.unsyncedTxKeys[txKey];
            }
          }),
        );
      } catch (e) {
        console.warn(failureMessage, e);
      } finally {
        syncingTxKeys.delete(txKey);
      }
    };

    return {
      transactionsPool: {},
      lastAddedTxKey: undefined,
      initialTx: undefined,
      unsyncedTxKeys: {},

      reconcileUnsyncedTransactions: async () => {
        if (!onRemoteCreate || isReconciling) return;

        const unsyncedKeys = Object.keys(get().unsyncedTxKeys || {});
        if (unsyncedKeys.length === 0) return;

        isReconciling = true;

        try {
          for (const key of unsyncedKeys) {
            if (!get().transactionsPool[key]) {
              // If tx is no longer in pool, clear it from unsynced
              set((s) =>
                produce(s, (draft) => {
                  if (draft.unsyncedTxKeys) delete draft.unsyncedTxKeys[key];
                }),
              );
              continue;
            }

            await syncTransaction(key, `[Pulsar] Failed to reconcile tx ${key}:`);
          }
        } finally {
          isReconciling = false;
        }
      },

      addTxToPool: (tx) => {
        validateTransaction(tx);

        const newTx = {
          ...tx,
          pending: true, // Ensure all new transactions start as pending.
          // Synced only once `onRemoteCreate` resolves; until then the key is listed in `unsyncedTxKeys`, so an
          // interrupted sync (for example a closed tab) is retried later.
          ...(onRemoteCreate && { syncStatus: 'pending-sync' as const }),
        };

        set((state) =>
          produce(state, (draft) => {
            draft.lastAddedTxKey = tx.txKey;

            if (tx.txKey) {
              if (onRemoteCreate) {
                if (!draft.unsyncedTxKeys) {
                  draft.unsyncedTxKeys = {};
                }
                draft.unsyncedTxKeys[tx.txKey] = true;
              }

              // Finished transactions past their term go first
              for (const key of expiredTransactionKeys(state.transactionsPool as TransactionPool<T>, retentionDays)) {
                delete draft.transactionsPool[key];
                if (draft.unsyncedTxKeys) delete draft.unsyncedTxKeys[key];
              }

              // Eviction: the oldest finished transactions make room for the new one. A transaction still pending is
              // never evicted, so its tracker can always record the result; while many are pending the pool may hold
              // more than `maxTransactions`, and it shrinks back as they finish and new ones are added.
              const finishedOldestFirst = (Object.values(draft.transactionsPool) as T[])
                .filter(
                  (pooledTx) => pooledTx.txKey !== tx.txKey && (!pooledTx.pending || isFinishedStatus(pooledTx.status)),
                )
                .sort((a, b) => a.localTimestamp - b.localTimestamp);
              let count = Object.keys(draft.transactionsPool).length + (draft.transactionsPool[tx.txKey] ? 0 : 1);
              for (const finishedTx of finishedOldestFirst) {
                if (count <= maxTransactions) break;
                delete draft.transactionsPool[finishedTx.txKey];
                count--;
              }

              draft.transactionsPool[tx.txKey] = newTx as (typeof draft.transactionsPool)[string];
            }
          }),
        );

        // The remote sync runs in the background, so a slow or unreachable backend never delays tracking.
        if (onRemoteCreate && tx.txKey) {
          void syncTransaction(tx.txKey, '[Pulsar] onRemoteCreate failed, transaction queued for background sync:');
        }

        return Promise.resolve();
      },

      updateTxParams: (txKey, fields) => {
        const wasFinished = isFinishedStatus(get().transactionsPool[txKey]?.status);
        set((state) =>
          produce(state, (draft) => {
            const tx = draft.transactionsPool[txKey];
            // Ensure the transaction exists before attempting to update.
            if (tx) {
              Object.assign(tx, fields);
            }
          }),
        );

        // The "transaction finished" event: once, on the move from a non-final to a final status
        const updatedTx = get().transactionsPool[txKey];
        if (onTxFinished && updatedTx && !wasFinished && isFinishedStatus(updatedTx.status)) {
          onTxFinished(updatedTx);
        }

        // Trigger reconciliation if transitioning to a terminal state and it's unsynced
        if (isFinishedStatus(fields.status)) {
          if (get().reconcileUnsyncedTransactions && get().unsyncedTxKeys?.[txKey]) {
            // Fire and forget asynchronous reconciliation
            get()
              .reconcileUnsyncedTransactions()
              .catch((err: unknown) => {
                console.error('[Pulsar] Terminal reconciliation failed:', err);
              });
          }
        }
      },

      removeTxFromPool: (txKey) => {
        set((state) =>
          produce(state, (draft) => {
            delete draft.transactionsPool[txKey];
          }),
        );
      },

      closeTxTrackedModal: (txKey) => {
        set((state) =>
          produce(state, (draft) => {
            if (txKey && draft.transactionsPool[txKey]) {
              const tx = draft.transactionsPool[txKey];
              draft.transactionsPool[txKey] = {
                ...tx,
                isTrackedModalOpen: false,
              } as (typeof draft.transactionsPool)[string];
            }
            // Always clear the initial transaction state when a modal is closed
            draft.initialTx = undefined;
          }),
        );
      },

      getLastTxKey: () => get().lastAddedTxKey,
    };
  };
}
