import { ITxTrackingStore, Transaction } from '@tuwaio/pulsar-core';
import React, { createContext, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';

// --- CORE TYPES ---
export type PulsarStore<TTransaction extends Transaction> = ITxTrackingStore<TTransaction>;

// Type alias for a store that knows the context's bound Transaction type (T)
type PulsarStoreBound<T extends Transaction> = StoreApi<PulsarStore<T>>;

// --- GLOBAL HOOK BINDINGS (The mutable part) ---

// This interface reflects the actual function signature that components call.
// T (Transaction type) is now an optional generic argument of the hook itself.
export interface UsePulsarStoreFn {
  // 1. User provides selector, TTransaction is inferred by TS's implicit behavior (fallback to the bounded T).
  <TSelected>(selector: (state: PulsarStore<any>) => TSelected): TSelected;
  // 2. User explicitly provides TTransaction. This ensures correct state typing inside the selector.
  <TTransaction extends Transaction, TSelected>(selector: (state: PulsarStore<TTransaction>) => TSelected): TSelected;
}

// Global object to hold the actual Bounded Hook instance assigned by the Provider.
export const PulsarStoreBindings = {
  // eslint-disable-next-line
  usePulsarStore: ((selector: any): any => {
    throw new Error('usePulsarStore must be called within PulsarCoreProvider.');
  }) as UsePulsarStoreFn,
};

// --- FACTORY LOGIC (Bounded Store) ---

/**
 * Factory function to create a unique React Context and a strictly typed Bounded Hook for a specific T.
 */
export function createPulsarStoreContextAndHook<T extends Transaction>() {
  const StoreContext: React.Context<PulsarStoreBound<T> | null> = createContext<PulsarStoreBound<T> | null>(null);

  // The Bounded Hook implementation. It is internally bound to T from the provider's scope.
  const useBoundedPulsarStore: UsePulsarStoreFn = ((selector: any): any => {
    const store = useContext(StoreContext); // Use the strictly typed local Context

    if (!store) {
      throw new Error('usePulsarStore must be used within a PulsarCoreProvider');
    }

    // When the hook is called, TS checks the argument type (selector).
    // If the user specified <MyTx>, the selector has type PulsarStore<MyTx>.
    // We pass the store (which is PulsarStore<TProvider>) and rely on type compatibility
    // (MyTx must extend TProvider or a safe base type, which is handled in the implementation).
    return useStore(store, selector);
  }) as UsePulsarStoreFn; // Cast to the public interface

  return { StoreContext, usePulsarStore: useBoundedPulsarStore };
}

// --- CONSUMER API (Public Hook) ---

/**
 * Public hook to access the Pulsar Store.
 * NOTE: T and TSelected are now inferred based on the Overloads in UsePulsarStoreFn.
 */
export function usePulsarStore<T extends Transaction = Transaction, TSelected = unknown>(
  selector: (state: PulsarStore<T>) => TSelected,
): TSelected {
  // Delegate the call to the Bounded Hook assigned by the Provider.
  // We use the most general call signature here to let the Bounded Hook's overloads do the work.
  return PulsarStoreBindings.usePulsarStore(selector);
}

// Global context placeholder (for Provider import compatibility)
export const PulsarStoreContext = {} as React.Context<StoreApi<PulsarStore<any>> | null>;
