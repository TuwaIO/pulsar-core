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
 *
 * @example
 * ```tsx
 * import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
 *
 * function AppLayout() {
 *   useInitializeTransactionsPool({
 *     initializeTransactionsPool: store.getState().initializeTransactionsPool,
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
}: UseInitializeTransactionsPoolParams) => {
  useEffect(() => {
    let isActive = true;

    const runInitialization = async () => {
      try {
        await initializeTransactionsPool();

        if (!isActive) return;
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
  }, [initializeTransactionsPool, onError]);
};
