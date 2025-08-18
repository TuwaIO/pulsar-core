/**
 * @file This file defines a React hook for initializing the transaction pool.
 * This hook is crucial for resuming the tracking of pending transactions after a page reload.
 */

import { useEffect } from 'react';

/**
 * An internal helper function to safely execute the initialization process.
 * It wraps the call in a try-catch block to handle any potential errors.
 *
 * @param {() => Promise<void>} initializeTransactionsPool - The async function from the store that starts the tracking process for pending transactions.
 * @param {(error: Error) => void} errorHandler - A callback function to handle any errors that occur during initialization.
 * @returns {Promise<void>}
 */
const loadTransactions = async (
  initializeTransactionsPool: () => Promise<void>,
  errorHandler: (error: Error) => void,
): Promise<void> => {
  try {
    await initializeTransactionsPool();
  } catch (error) {
    errorHandler(error as Error);
  }
};

/**
 * A React hook that triggers the initialization of the transaction pool when the component mounts.
 * This ensures that any pending transactions from a previous session are picked up and tracked again.
 *
 * @param {() => Promise<void>} initializeTransactionsPool - The `initializeTransactionsPool` function from the Zustand store.
 * @param {(error: Error) => void} [customErrorHandler] - An optional custom function to handle errors during initialization. Defaults to console.error.
 */
export const useInitializeTransactionsPool = (
  initializeTransactionsPool: () => Promise<void>,
  customErrorHandler?: (error: Error) => void,
) => {
  const handleError = (error: Error) => {
    if (customErrorHandler) {
      customErrorHandler(error);
    } else {
      console.error('Failed to initialize transactions pool:', error);
    }
  };

  useEffect(() => {
    // The dependency array ensures this effect runs only when the function reference changes,
    // which should typically be only on the initial render.
    loadTransactions(initializeTransactionsPool, handleError);
  }, [initializeTransactionsPool, customErrorHandler]);
};
