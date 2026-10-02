/**
 * @file An in-memory store that merges a paginated remote transaction history with the local transaction pool.
 */

import { Immer } from 'immer';
import { createStore } from 'zustand/vanilla';

import {
  ITxInMemoryStore,
  ITxInMemoryStoreParameters,
  Transaction,
  TransactionPool,
  TransactionStatus,
} from '../types';
import { validateTransaction } from '../utils/transactionValidation';

/**
 * Immer instance of the in-memory store. Auto-freeze is off because the store is updated often and its pool holds
 * objects shared with the persistent store; unlike `setAutoFreeze(false)`, it leaves the global Immer config alone.
 */
const { produce } = new Immer({ autoFreeze: false });

/**
 * Drops remote transactions whose title, description or payload break Pulsar's safety limits.
 *
 * @param remoteTxs - Transactions returned by `getHistory`.
 * @returns The valid transactions.
 */
const filterValidTransactions = <T extends Transaction>(remoteTxs: T[]): T[] =>
  remoteTxs.filter((remoteTx) => {
    try {
      validateTransaction(remoteTx);
      return true;
    } catch (error) {
      console.warn('[Pulsar] Skipped invalid transaction from history:', error);
      return false;
    }
  });

/**
 * Returns `true` when a transaction has already reached its final on-chain state.
 *
 * Terminal transactions should not be overwritten by stale data from a local cache or
 * by a later remote payload that is older than the confirmed state.
 *
 * @param status The current transaction status.
 * @returns `true` if the status is terminal; otherwise, `false`.
 */
const isTerminalStatus = (status?: TransactionStatus): boolean =>
  status === TransactionStatus.Success || status === TransactionStatus.Failed || status === TransactionStatus.Replaced;

/**
 * Safely merges a transaction into the in-memory pool.
 *
 * The merge is intentionally conservative:
 * - existing terminal transactions are preserved
 * - non-terminal or missing entries can be replaced
 *
 * @template T The transaction type.
 * @param pool The target transaction pool.
 * @param tx The transaction to merge into the pool.
 * @returns `true` if the transaction was written to the pool; otherwise, `false`.
 */
const mergeTransactionIntoPool = <T extends Transaction>(pool: TransactionPool<T>, tx: T): boolean => {
  const existingTx = pool[tx.txKey];

  if (existingTx) {
    if (isTerminalStatus(existingTx.status)) {
      return false;
    }

    if (existingTx.pending) {
      // If the incoming tx is terminal (Success/Failed/Replaced), it wins.
      if (isTerminalStatus(tx.status)) {
        pool[tx.txKey] = { ...existingTx, ...tx };
        return true;
      }

      // If both are pending, we only update if the new one has more confirmations.
      const newConfirmations = typeof tx.confirmations === 'number' ? tx.confirmations : 0;
      const oldConfirmations = typeof existingTx.confirmations === 'number' ? existingTx.confirmations : 0;

      if (newConfirmations > oldConfirmations) {
        pool[tx.txKey] = { ...existingTx, ...tx };
        return true;
      }

      return false;
    }
  }

  pool[tx.txKey] = tx;
  return true;
};

/**
 * Creates an in-memory store that shows the remote transaction history of a wallet (for example from Quasar) together
 * with the local pool of the persistent store. Nothing in it is persisted. Keep it in sync with the persistent store by
 * calling `syncWithLocalPool` from that store's `subscribe` listener.
 *
 * Merge rules: a transaction that is `Success`, `Failed` or `Replaced` in memory is never overwritten; a pending one
 * is overwritten only by a terminal transaction or by one with more confirmations; any other one is overwritten.
 *
 * History pages are validated like `injectExternalPendingTxs` does: transactions whose title, description or payload
 * break the safety limits are skipped with a warning and are not passed to `onHistoryFetched`.
 *
 * Side effects: `fetchInitial` and `fetchNextPage` call `getHistory`, usually a network request. The store uses its
 * own Immer instance without auto-freeze and does not change the global Immer configuration.
 *
 * @template T - The application transaction type.
 * @param params - The store configuration.
 * @param params.localTransactionsPool - The initial pool.
 * @param params.reconcileUnsyncedTransactions - Called by `fetchInitial` before the first page is loaded.
 * @param params.getHistory - Loads one page of the remote history. A `null` result stops loading without changing the
 * pool; a thrown error sets `isError`.
 * @param params.onHistoryFetched - Called in a microtask with the valid transactions of every loaded page.
 * @returns A vanilla Zustand store; bind it to React with `createBoundedUseStore`.
 */
export function createTxInMemoryStore<T extends Transaction>({
  localTransactionsPool,
  reconcileUnsyncedTransactions,
  getHistory,
  onHistoryFetched,
}: ITxInMemoryStoreParameters<T>) {
  /**
   * Normalizes loading/error flags before any async request.
   *
   * @param isLoading Whether the store is currently loading.
   */
  const setRequestState = (isLoading: boolean) => {
    return { isLoading, isError: false };
  };

  /**
   * Applies a page response to the in-memory store in a single, consistent way.
   *
   * @param response The paginated response returned by `getHistory`.
   */
  const applyHistoryResponse = (response: Awaited<ReturnType<NonNullable<typeof getHistory>>>) => {
    if (!response) return { isLoading: false };

    const validDocs = filterValidTransactions(response.docs);

    // TRIGGER THE BRIDGE: Pass the fetched documents to the external callback
    if (onHistoryFetched) {
      // Use setTimeout or queueMicrotask to avoid blocking the state update render cycle
      queueMicrotask(() => onHistoryFetched!(validDocs));
    }

    return (state: ITxInMemoryStore<T>) =>
      produce(state, (draft) => {
        const pool = draft.transactionsPool as TransactionPool<T>;

        for (const remoteTx of validDocs) {
          mergeTransactionIntoPool(pool, remoteTx);
        }

        draft.currentPage = response.page;
        draft.hasMore = response.hasNextPage;
        draft.isLoading = false;
      });
  };

  return createStore<ITxInMemoryStore<T>>()((set, get) => ({
    transactionsPool: localTransactionsPool,
    isLoading: false,
    isError: false,
    hasMore: false,
    currentPage: 1,

    syncWithLocalPool: (localPool) => {
      set((state) =>
        produce(state, (draft) => {
          const pool = draft.transactionsPool as TransactionPool<T>;
          for (const localTx of Object.values(localPool)) {
            mergeTransactionIntoPool(pool, localTx);
          }
        }),
      );
    },

    fetchInitial: async (walletAddress) => {
      if (!getHistory || !walletAddress) return;

      set(setRequestState(true));

      if (reconcileUnsyncedTransactions) {
        await reconcileUnsyncedTransactions();
      }

      try {
        const response = await getHistory({ page: 1, walletAddress });
        set(applyHistoryResponse(response));
      } catch (error) {
        console.error('[Pulsar] Failed to fetch initial transaction history:', error);
        set({ isLoading: false, isError: true });
      }
    },

    fetchNextPage: async (walletAddress) => {
      const { hasMore, isLoading, currentPage } = get();

      if (!getHistory || !hasMore || isLoading || !walletAddress) return;

      set(setRequestState(true));

      try {
        const nextPage = currentPage + 1;
        const response = await getHistory({ page: nextPage, walletAddress });
        set(applyHistoryResponse(response));
      } catch (error) {
        console.error(`[Pulsar] Failed to fetch transaction history page ${currentPage + 1}:`, error);
        set({ isLoading: false, isError: true });
      }
    },
  }));
}
