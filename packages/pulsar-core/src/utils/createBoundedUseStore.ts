/**
 * @file Binds a vanilla Zustand store (such as the Pulsar stores) to React with a typed hook.
 *
 * @see {@link https://zustand.docs.pmnd.rs/guides/typescript#bounded-usestore-hook-for-vanilla-stores Zustand: bounded useStore hook}
 */

import { StoreApi, useStore } from 'zustand';

/**
 * The state type of a Zustand store: the return type of its `getState` method.
 *
 * @template S - The store type.
 */
export type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

/**
 * Creates a React hook bound to a vanilla Zustand store, so components do not pass the store on every call.
 *
 * The hook calls `useStore` from `zustand`, so it follows the rules of React hooks and needs `react` in the app. Call it
 * without arguments to subscribe to the whole state, or with a selector to subscribe to a slice. A selector that
 * returns a new object or array on every call (such as the transaction selectors) re-renders on every store update;
 * select stable values or memoize.
 *
 * @template S - The store type.
 * @param store - The vanilla Zustand store, for example the result of `createPulsarStore`.
 * @returns A hook: `useBoundedStore()` returns the whole state, `useBoundedStore(selector)` returns the selected value.
 *
 * @example
 * ```ts
 * const usePulsarStore = createBoundedUseStore(pulsarStore);
 * const executeTxAction = usePulsarStore((state) => state.executeTxAction);
 * ```
 */
export const createBoundedUseStore = ((store) => (selector) => useStore(store, selector)) as <
  S extends StoreApi<unknown>,
>(
  store: S,
) => {
  // This implementation uses a Immediately Invoked Function Expression (IIFE)
  // trick combined with casting to achieve the desired overloaded function signature in a concise way.
  (): ExtractState<S>;
  <T>(selector: (state: ExtractState<S>) => T): T;
};
