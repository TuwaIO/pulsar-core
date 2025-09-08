import { Transaction, TxAdapter } from '../types';

/**
 * Finds and returns the appropriate transaction adapter for a given transaction based on the adapter key.
 *
 * @template TR - The type representing the transaction result or payload.
 * @template T - The type of the transaction which extends the base Transaction type.
 * @template A - The type of additional properties or methods in the adapter.
 *
 * @param {Object} params - The input parameters.
 * @param {T} params.tx - The transaction object which includes the adapter key to be matched.
 * @param {TxAdapter<TR, T, A>[]} params.adapters - An array of available transaction adapters, each with a unique key.
 * @returns {TxAdapter<TR, T, A>} The transaction adapter matching the transaction's `adapter` key, or the first adapter in the array if no match is found.
 */
export const selectTxAdapter = <TR, T extends Transaction<TR>, A>({
  tx,
  adapters,
}: {
  tx: T;
  adapters: TxAdapter<TR, T, A>[];
}): TxAdapter<TR, T, A> => {
  const adapter = adapters.find((adapter) => adapter.key === tx.adapter);
  if (adapter) {
    return adapter;
  } else {
    return adapters[0];
  }
};
