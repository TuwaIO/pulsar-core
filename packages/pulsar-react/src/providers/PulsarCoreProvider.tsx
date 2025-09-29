// PulsarCoreProvider.tsx

'use client';

import { createPulsarStore, Transaction } from '@tuwaio/pulsar-core';
import { ITxTrackingStore, PulsarAdapter } from '@tuwaio/pulsar-core/src';
import once from 'lodash.once';
import { PropsWithChildren } from 'react';
import { PersistOptions } from 'zustand/middleware';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { usePulsarStore as globalUsePulsarStore } from '../hooks/pulsarHook';
import type { BoundedUseStore } from '../hooks/pulsarStoreFactory';
import { createPulsarStoreContextAndHook } from '../hooks/pulsarStoreFactory';
import { useInitializeTransactionsPool } from '../hooks/useInitializeTransactionsPool';

interface PulsarCoreProviderProps<T extends Transaction>
  extends PropsWithChildren,
    PulsarAdapter<T>,
    Partial<PersistOptions<ITxTrackingStore<T>>> {}

const getBoundedStoreInstance = once(<T extends Transaction>(params: PulsarCoreProviderProps<T>) => {
  const { StoreContext, usePulsarStore: useBoundedPulsarStore } = createPulsarStoreContextAndHook<T>();

  const store = createPulsarStore<T>({
    ...params,
    name: params.name ?? 'tuwa:pulsar-store',
  });

  return { StoreContext, usePulsarStore: useBoundedPulsarStore, store };
});

export function PulsarCoreProvider<T extends Transaction>({ children, ...params }: PulsarCoreProviderProps<T>) {
  const { StoreContext, usePulsarStore: useBoundedPulsarStore, store } = getBoundedStoreInstance(params);

  useInitializeTransactionsPool({
    initializeTransactionsPool: store.getState().initializeTransactionsPool,
    onError: (error) => console.error('Failed to initialize transactions pool:', error),
  });

  (globalUsePulsarStore as BoundedUseStore<T>) = useBoundedPulsarStore;

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
