/**
 * @file React hook for bootstrapping the Pulsar transaction lifecycle on app start.
 * It rehydrates pending transaction trackers and can optionally perform an initial
 * remote history fetch right after tracker initialization.
 */

import { useEffect } from 'react';

/**
 * Configuration for {@link useInitializeTransactionsPool}.
 */
export type UseInitializeTransactionsPoolParams = {
  /**
   * Re-initializes background trackers for all pending transactions stored in the Pulsar store.
   */
  initializeTransactionsPool: () => Promise<void>;
  /**
   * Optional error handler called when initialization or the optional initial fetch fails.
   *
   * @defaultValue `console.error`
   */
  onError?: (error: Error) => void;
  /**
   * Optional callback that performs the initial history fetch from the remote data source.
   * This is useful when the in-memory store should be populated immediately after tracker
   * restoration.
   */
  initialFetchFromDB?: () => Promise<void>;
};

/**
 * Re-initializes pending transaction trackers when the component mounts.
 *
 * Use this hook once in your application's root layout or top-level provider.
 * It restores tracker activity after reloads and can optionally fetch the initial
 * remote transaction history right after restoration.
 *
 * @param params Hook configuration.
 * @param params.initializeTransactionsPool Function that restores trackers for pending transactions.
 * @param params.onError Optional custom error handler.
 * @param params.initialFetchFromDB Optional callback for loading the initial remote history.
 *
 * @example
 * ```tsx
 * import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
 *
 * function AppLayout() {
 *   useInitializeTransactionsPool({
 *     initializeTransactionsPool: store.getState().initializeTransactionsPool,
 *     initialFetchFromDB: store.getState().fetchInitial,
 *     onError: (error) => console.warn('Failed to restore transactions:', error),
 *   });
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export const useInitializeTransactionsPool = ({
  initializeTransactionsPool,
  onError,
  initialFetchFromDB,
}: UseInitializeTransactionsPoolParams) => {
  useEffect(() => {
    let isActive = true;

    const runInitialization = async () => {
      try {
        await initializeTransactionsPool();

        if (!isActive) return;

        if (initialFetchFromDB) {
          await initialFetchFromDB();
        }
      } catch (error) {
        const fallbackErrorHandler = (e: Error) => {
          console.error('[Pulsar] Failed to initialize transactions pool:', e);
        };

        (onError ?? fallbackErrorHandler)(error as Error);
      }
    };

    void runInitialization();

    return () => {
      isActive = false;
    };
  }, [initializeTransactionsPool, initialFetchFromDB, onError]);
};
