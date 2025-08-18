/**
 * @file This file provides a utility for creating a bounded Zustand hook from a vanilla store.
 * This is a recommended pattern for using vanilla stores with React to ensure full type safety.
 *
 * @see https://zustand.docs.pmnd.rs/guides/typescript#bounded-usestore-hook-for-vanilla-stores
 */

import { StoreApi, useStore } from 'zustand';

/**
 * A utility type to infer the state shape from a Zustand store type.
 * @template S The type of the Zustand store (`StoreApi`).
 */
type ExtractState<S> = S extends { getState: () => infer X } ? X : never;

/**
 * Creates a bounded `useStore` hook from a vanilla Zustand store instance.
 * The returned hook is fully typed and can be used with or without a selector.
 *
 * @template S The type of the Zustand store (`StoreApi`).
 * @param {S} store - The vanilla Zustand store instance.
 * @returns {function} A hook that can be called with an optional selector function.
 * - When called with a selector (`useBoundedStore(state => state.someValue)`), it returns the selected slice of the state.
 */
export const createBoundedUseStore = ((store) => (selector) => useStore(store, selector)) as <
  S extends StoreApi<unknown>,
>(
  store: S,
) => {
  (): ExtractState<S>;
  <T>(selector: (state: ExtractState<S>) => T): T;
};
