/**
 * @file The core Zustand slice of the transaction store: the transaction pool and the actions that add, update and
 * remove transactions and synchronize them with a remote backend.
 */

import { produce } from 'immer';

import { IInitializeTxTrackingStore, PulsarAdapter, StoreSlice, Transaction, TransactionStatus } from '../types';
import { validateTransaction } from '../utils/transactionValidation';

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
 * @param params.maxTransactions - Maximum number of transactions in the pool; `addTxToPool` evicts the oldest one
 * (by `localTimestamp`) when the pool is full.
 * @param params.onRemoteCreate - Optional remote sync callback, called in the background by `addTxToPool` (see
 * `SyncCallbacks`).
 * @returns A slice creator for Zustand's `create` / `createStore`.
 */
export function initializeTxTrackingStore<T extends Transaction>({
  maxTransactions,
  onRemoteCreate,
}: Pick<PulsarAdapter<T>, 'onRemoteCreate'> & { maxTransactions: number }): StoreSlice<IInitializeTxTrackingStore<T>> {
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

              const currentCount = Object.keys(draft.transactionsPool).length;

              // FIFO Eviction Policy
              if (currentCount >= maxTransactions) {
                const sortedTxs = Object.values(draft.transactionsPool).sort((a, b) => {
                  return (a as T).localTimestamp - (b as T).localTimestamp;
                });

                if (sortedTxs.length > 0) {
                  const oldestTx = sortedTxs[0] as T;
                  delete draft.transactionsPool[oldestTx.txKey];
                }
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
        set((state) =>
          produce(state, (draft) => {
            const tx = draft.transactionsPool[txKey];
            // Ensure the transaction exists before attempting to update.
            if (tx) {
              Object.assign(tx, fields);
            }
          }),
        );

        // Trigger reconciliation if transitioning to a terminal state and it's unsynced
        const isTerminalStatus =
          fields.status === TransactionStatus.Success ||
          fields.status === TransactionStatus.Failed ||
          fields.status === TransactionStatus.Replaced;

        if (isTerminalStatus) {
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
