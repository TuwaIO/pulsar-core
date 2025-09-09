/**
 * @file This file defines a React hook for initializing the transaction pool.
 * This hook is crucial for resuming the tracking of pending transactions after a page reload.
 */

import { useEffect } from 'react';

/**
 * A React hook that triggers the initialization of the transaction pool when the component mounts.
 *
 * This should be used once in your application's layout or root component. It ensures that any
 * pending transactions from a previous session (stored in `localStorage`) are picked up and

 * their trackers are re-activated.
 *
 * @param {object} params - The parameters for the hook.
 * @param {() => Promise<void>} params.initializeTransactionsPool - The `initializeTransactionsPool` function from your Pulsar store instance.
 * @param {(error: Error) => void} [params.onError] - An optional custom function to handle any errors that occur during initialization. Defaults to `console.error`.
 *
 * @example
 * ```tsx
 * import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
 * import { pulsarStore } from './path/to/your/store';
 *
 * function AppLayout({ children }) {
 * // This hook will run once when the layout mounts.
 * useInitializeTransactionsPool({
 * initializeTransactionsPool: pulsarStore.getState().initializeTransactionsPool,
 * onError: (err) => console.warn('Failed to re-initialize trackers:', err),
 * });
 *
 * return <div>{children}</div>;
 * }
 * ```
 */
export const useInitializeTransactionsPool = ({
  initializeTransactionsPool,
  onError,
}: {
  initializeTransactionsPool: () => Promise<void>;
  onError?: (error: Error) => void;
}) => {
  useEffect(() => {
    const reinitializeTrackers = async () => {
      try {
        await initializeTransactionsPool();
      } catch (error) {
        const errorHandler = onError ?? ((e: Error) => console.error('Failed to initialize transactions pool:', e));
        errorHandler(error as Error);
      }
    };

    // Run the initialization process.
    reinitializeTrackers();

    // The dependency array is empty to ensure this effect runs only once on mount.
    // The functions from a vanilla Zustand store are stable and do not need to be in the array.
  }, [initializeTransactionsPool, onError]);
};
