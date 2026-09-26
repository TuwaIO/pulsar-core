/**
 * @file React hook that restarts the trackers of pending Pulsar transactions when the app mounts.
 */

import { useEffect, useEffectEvent } from 'react';

/**
 * The parameters of {@link useInitializeTransactionsPool}.
 */
export type UseInitializeTransactionsPoolParams = {
  /**
   * The store's `initializeTransactionsPool` action (`createPulsarStore` from `@tuwaio/pulsar-core`). Pass a stable
   * reference: the hook runs it again whenever it changes.
   */
  initializeTransactionsPool: () => Promise<void>;
  /**
   * Called when `initializeTransactionsPool` rejects. The latest function is used, so an inline callback does not run
   * the initialization again.
   *
   * @defaultValue Logs the error with `console.error`.
   * @param error - The rejection reason of `initializeTransactionsPool`.
   */
  onError?: (error: Error) => void;
};

/**
 * Calls `initializeTransactionsPool` in an effect after the component mounts, so the trackers of transactions that
 * were pending before a page reload start again. It runs on the client only, after the store has restored its state
 * from `localStorage`.
 *
 * Use it once, in a component that stays mounted (a root layout or provider): every run starts new trackers. The
 * effect runs again only when `initializeTransactionsPool` changes. In development, React Strict Mode runs effects
 * twice, so pending transactions get two trackers there.
 *
 * @param params - The hook parameters.
 * @param params.initializeTransactionsPool - The store's `initializeTransactionsPool` action.
 * @param params.onError - Called when the initialization rejects; defaults to `console.error`. Not called after
 * unmount.
 *
 * @example
 * ```tsx
 * import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
 *
 * import { pulsarStore } from './pulsarStore';
 *
 * export function PulsarInitializer() {
 *   useInitializeTransactionsPool({
 *     initializeTransactionsPool: pulsarStore.getState().initializeTransactionsPool,
 *     onError: (error) => console.warn('Failed to restore transactions:', error),
 *   });
 *
 *   return null;
 * }
 * ```
 */
export const useInitializeTransactionsPool = ({
  initializeTransactionsPool,
  onError,
}: UseInitializeTransactionsPoolParams) => {
  // Reads the latest `onError` without being an effect dependency, so an inline callback
  // does not restart the trackers on every render.
  const handleError = useEffectEvent((error: Error) => {
    const fallbackErrorHandler = (e: Error) => {
      console.error('[Pulsar] Failed to initialize transactions pool:', e);
    };

    (onError ?? fallbackErrorHandler)(error);
  });

  useEffect(() => {
    let isActive = true;

    const runInitialization = async () => {
      try {
        await initializeTransactionsPool();
      } catch (error) {
        if (!isActive) return;

        handleError(error as Error);
      }
    };

    void runInitialization();

    return () => {
      isActive = false;
    };
  }, [initializeTransactionsPool]);
};
