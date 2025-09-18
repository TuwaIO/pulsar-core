/**
 * @file This file contains a utility function for selecting a specific transaction adapter from a list.
 */

import { ITxTrackingStore, Transaction, TransactionAdapter, TxAdapter } from '../types';

/**
 * Selects a transaction adapter from a list based on a provided key.
 *
 * This function searches through an array of `TxAdapter` instances and returns the one
 * that matches the given `adapterKey`. If no specific adapter is found, it logs a warning
 * and returns the first adapter in the array as a fallback. This fallback mechanism
 * ensures that the system can still function, but it highlights a potential configuration issue.
 *
 * @template T - The transaction type, extending the base `Transaction`.
 *
 * @param {object} params - The parameters for the selection.
 * @param {TransactionAdapter} params.adapterKey - The key of the desired adapter.
 * @param {TxAdapter<T> | TxAdapter<T>[]} params.adapter - Adapter or an array of adapters for different chains or transaction types.
 *
 * @returns {TxAdapter<T> | undefined} The found transaction adapter, the fallback adapter, or undefined if the adapters array is empty.
 */
export const selectAdapterByKey = <T extends Transaction>({
  adapterKey,
  adapter,
}: {
  adapterKey: TransactionAdapter;
} & Pick<ITxTrackingStore<T>, 'adapter'>): TxAdapter<T> | undefined => {
  if (Array.isArray(adapter)) {
    if (adapter.length === 0) {
      console.error('Adapter selection failed: The provided adapters array is empty.');
      return undefined;
    }

    const foundAdapter = adapter.find((a) => a.key === adapterKey);

    if (foundAdapter) {
      return foundAdapter;
    } else {
      console.warn(
        `No adapter found for key: "${adapterKey}". Falling back to the first available adapter: "${adapter[0].key}".`,
      );
      return adapter[0];
    }
  }
  return adapter;
};
