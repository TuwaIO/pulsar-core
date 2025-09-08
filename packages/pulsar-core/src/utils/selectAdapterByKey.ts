import { Transaction, TransactionAdapter, TxAdapter } from '../types';

/**
 * Selects and returns a transaction adapter from a list of adapters based on the provided adapter key.
 * If no matching adapter is found, the first adapter in the list is returned as a fallback.
 *
 * @template TR - Represents the transaction response type.
 * @template T - Extends the Transaction type and represents the transaction entity.
 * @template A - Represents the adapter type.
 *
 * @param {Object} params - Configuration object for selecting the adapter.
 * @param {TransactionAdapter} params.adapterKey - The key used to identify the desired transaction adapter.
 * @param {TxAdapter<TR, T, A>[]} params.adapters - An array of available transaction adapters.
 *
 * @returns {TxAdapter<TR, T, A>} The transaction adapter corresponding to the provided key, or the first adapter in the list.
 */
export const selectAdapterByKey = <TR, T extends Transaction<TR>, A>({
  adapterKey,
  adapters,
}: {
  adapterKey: TransactionAdapter;
  adapters: TxAdapter<TR, T, A>[];
}): TxAdapter<TR, T, A> => {
  const adapter = adapters.find((adapter) => adapter.key === adapterKey);
  if (adapter) {
    return adapter;
  } else {
    return adapters[0];
  }
};
