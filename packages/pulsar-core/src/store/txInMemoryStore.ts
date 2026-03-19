import { produce, setAutoFreeze } from 'immer';
import { createStore } from 'zustand/vanilla';

import {
  ITxInMemoryStore,
  ITxInMemoryStoreParameters,
  Transaction,
  TransactionPool,
  TransactionStatus,
} from '../types';

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

  if (isTerminalStatus(existingTx?.status)) {
    return false;
  }

  pool[tx.txKey] = tx;
  return true;
};

/**
 * Creates an in-memory transaction store with synchronized local and remote sources.
 *
 * The store is designed to:
 * - keep a local transaction pool in sync with remote history
 * - preserve terminal transaction states
 * - support paginated history loading
 * - avoid duplicated merge logic across store actions
 *
 * @template T The transaction type.
 * @param params Store configuration parameters.
 * @param params.getHistory Optional remote history fetcher.
 * @returns A Zustand vanilla store instance for in-memory transaction management.
 */
export function createTxInMemoryStore<T extends Transaction>({
  getHistory,
  onHistoryFetched,
}: ITxInMemoryStoreParameters<T>) {
  /**
   * Disable Immer auto-freeze because Zustand store updates are performed frequently,
   * and freezing can introduce avoidable overhead and integration issues in runtime code.
   */
  setAutoFreeze(false);

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
    // TRIGGER THE BRIDGE: Pass the fetched documents to the external callback
    if (onHistoryFetched) {
      // Use setTimeout or queueMicrotask to avoid blocking the state update render cycle
      queueMicrotask(() => onHistoryFetched!(response.docs));
    }

    return (state: ITxInMemoryStore<T>) =>
      produce(state, (draft) => {
        const pool = draft.transactionsPool as TransactionPool<T>;

        for (const remoteTx of response.docs) {
          mergeTransactionIntoPool(pool, remoteTx);
        }

        draft.currentPage = response.page;
        draft.hasMore = response.hasNextPage;
        draft.isLoading = false;
      });
  };

  return createStore<ITxInMemoryStore<T>>()((set, get) => ({
    transactionsPool: {},
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

    fetchInitial: async () => {
      if (!getHistory) return;

      set(setRequestState(true));

      try {
        const response = await getHistory({ page: 1 });
        set(applyHistoryResponse(response));
      } catch (error) {
        console.error('[Pulsar] Failed to fetch initial transaction history:', error);
        set({ isLoading: false, isError: true });
      }
    },

    fetchNextPage: async () => {
      const { hasMore, isLoading, currentPage } = get();

      if (!getHistory || !hasMore || isLoading) return;

      set(setRequestState(true));

      try {
        const nextPage = currentPage + 1;
        const response = await getHistory({ page: nextPage });
        set(applyHistoryResponse(response));
      } catch (error) {
        console.error(`[Pulsar] Failed to fetch transaction history page ${currentPage + 1}:`, error);
        set({ isLoading: false, isError: true });
      }
    },
  }));
}
