/**
 * @file This file contains a utility function for selecting a specific transaction adapter from a list.
 */

import { Transaction, TransactionAdapter, TxAdapter } from '../types';

/**
 * Selects a transaction adapter from a list based on a provided key.
 *
 * This function searches through an array of `TxAdapter` instances and returns the one
 * that matches the given `adapterKey`. If no specific adapter is found, it logs a warning
 * and returns the first adapter in the array as a fallback. This fallback mechanism
 * ensures that the system can still function, but it highlights a potential configuration issue.
 *
 * @template TR - The type of the tracker identifier.
 * @template T - The transaction type, extending the base `Transaction`.
 * @template A - The type for the adapter-specific context or API.
 *
 * @param {object} params - The parameters for the selection.
 * @param {TransactionAdapter} params.adapterKey - The key of the desired adapter.
 * @param {TxAdapter<TR, T, A> | TxAdapter<TR, T, A>[]} params.adapter - Adapter or an array of adapters for different chains or transaction types.
 *
 * @returns {TxAdapter<TR, T, A> | undefined} The found transaction adapter, the fallback adapter, or undefined if the adapters array is empty.
 */
export const selectAdapterByKey = <TR, T extends Transaction<TR>, A>({
  adapterKey,
  adapter,
}: {
  adapterKey: TransactionAdapter;
  adapter: TxAdapter<TR, T, A> | TxAdapter<TR, T, A>[];
}): TxAdapter<TR, T, A> | undefined => {
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
