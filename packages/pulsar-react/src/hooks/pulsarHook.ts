import { ITxTrackingStore, Transaction } from '@tuwaio/pulsar-core';
import { createContext, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';

export type PulsarStore<TTransaction extends Transaction> = ITxTrackingStore<TTransaction>;

export const PulsarStoreContext = createContext<StoreApi<PulsarStore<Transaction>> | null>(null);

export function usePulsarStore<TTransaction extends Transaction, TSelected = unknown>(
  selector: (state: PulsarStore<TTransaction>) => TSelected,
): TSelected {
  const store = useContext(PulsarStoreContext);
  if (!store) {
    throw new Error('usePulsarStore must be used within a PulsarProvider');
  }
  return useStore(store as unknown as StoreApi<PulsarStore<TTransaction>>, selector);
}
