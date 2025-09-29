import { ITxTrackingStore, Transaction } from '@tuwaio/pulsar-core';
import { createContext, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';

// --- TYPES ---
export type PulsarStoreState<TTransaction extends Transaction> = ITxTrackingStore<TTransaction>;
type PulsarSelector<TTransaction extends Transaction, TSelected> = (state: PulsarStoreState<TTransaction>) => TSelected;

export type StoreContext<T extends Transaction> = React.Context<StoreApi<PulsarStoreState<T>> | null>;

/**
 * Interface for the Bounded Store Hook, which knows the specific Transaction type T.
 * We use function overloading to allow T to be inferred or explicitly set.
 */
export interface BoundedUseStore<T extends Transaction> {
  // Overload 1: Primary Usage - T is inferred from the bounded context. TSelected is inferred.
  <TSelected>(selector: PulsarSelector<T, TSelected>): TSelected;

  // Overload 2: Explicit TTransaction - Allows consuming component to specify a subtype TTransaction.
  // We MUST use a dummy TTransaction here that defaults to T (the outer bounding type)
  // and TSelected (TRet) is inferred.
  // NOTE: This overload is primarily here to guide TS, though in a Bounded Store
  // the outer generic T is usually the final type.
  <TSelected, TTransaction extends T = T>(selector: PulsarSelector<TTransaction, TSelected>): TSelected;
}

/**
 * Factory function to create a unique React Context and a strongly typed hook
 * for a specific Transaction type T.
 */
export function createPulsarStoreContextAndHook<T extends Transaction>() {
  const StoreContext = createContext<StoreApi<PulsarStoreState<T>> | null>(null);

  // The implementation must have the most general signature, which is enough
  // for the runtime to work (as all types flow from T in the context).
  const usePulsarStore = <TRet>(selector: (state: PulsarStoreState<T>) => TRet): TRet => {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error('usePulsarStore must be used within a PulsarCoreProvider');
    }

    return useStore(store, selector);
  };

  return {
    StoreContext,
    usePulsarStore: usePulsarStore as BoundedUseStore<T>,
  };
}
