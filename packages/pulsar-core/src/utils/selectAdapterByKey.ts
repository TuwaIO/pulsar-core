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
 * @param {TxAdapter<TR, T, A>[]} params.adapters - An array of available transaction adapters.
 *
 * @returns {TxAdapter<TR, T, A> | undefined} The found transaction adapter, the fallback adapter, or undefined if the adapters array is empty.
 */
export const selectAdapterByKey = <TR, T extends Transaction<TR>, A>({
  adapterKey,
  adapters,
}: {
  adapterKey: TransactionAdapter;
  adapters: TxAdapter<TR, T, A>[];
}): TxAdapter<TR, T, A> | undefined => {
  if (!adapters || adapters.length === 0) {
    console.error('Adapter selection failed: The provided adapters array is empty.');
    return undefined;
  }

  const adapter = adapters.find((a) => a.key === adapterKey);

  if (adapter) {
    return adapter;
  } else {
    console.warn(
      `No adapter found for key: "${adapterKey}". Falling back to the first available adapter: "${adapters[0].key}".`,
    );
    return adapters[0];
  }
};
