import { createPulsarStore, ITxTrackingStore, PulsarAdapter, Transaction } from '@tuwaio/pulsar-core';
import { PropsWithChildren, useRef } from 'react';
import { StoreApi } from 'zustand';
import { PersistOptions } from 'zustand/middleware';

import { PulsarStore, PulsarStoreContext } from '../hooks/pulsarHook';
import { useInitializeTransactionsPool } from '../hooks/useInitializeTransactionsPool';

interface PulsarCoreProviderProps<T extends Transaction>
  extends PropsWithChildren,
    PulsarAdapter<T>,
    Partial<PersistOptions<ITxTrackingStore<T>>> {}

export function PulsarCoreProvider<T extends Transaction>({ children, ...params }: PulsarCoreProviderProps<T>) {
  const storeRef = useRef<StoreApi<PulsarStore<T>> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createPulsarStore<T>({
      ...params,
      name: params.name ?? 'pulsar-store',
    });
  }

  const storeToProvide = storeRef.current as unknown as StoreApi<PulsarStore<Transaction>>;

  useInitializeTransactionsPool({
    initializeTransactionsPool: storeRef.current.getState().initializeTransactionsPool,
    onError: (error) => console.error('Failed to initialize transactions pool:', error),
  });

  return <PulsarStoreContext.Provider value={storeToProvide}>{children}</PulsarStoreContext.Provider>;
}
