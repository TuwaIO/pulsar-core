import { ITxTrackingStore, Transaction } from '@tuwaio/pulsar-core';
import { StoreApi } from 'zustand';

// 1. Define base types
export type PulsarStore<T extends Transaction> = ITxTrackingStore<T>;

// 2. Context Placeholder
// We use the most general Transaction type here for the global placeholder context.
export const PulsarStoreContext = {} as React.Context<StoreApi<PulsarStore<Transaction>> | null>;

// 3. Export the placeholder hook type.
// This must be compatible with the BoundedUseStore interface from the factory.
// We use the Overload pattern here to allow the consumer to skip T in the common case.
export declare function usePulsarStore<T extends Transaction = Transaction, TSelected = unknown>(
  selector: (state: PulsarStore<T>) => TSelected,
): TSelected;
