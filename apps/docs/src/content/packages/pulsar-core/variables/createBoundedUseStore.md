# createBoundedUseStore

> `const` **createBoundedUseStore**: \<`S`\>(`store`) => \{(): [`ExtractState`](/packages/pulsar-core/type-aliases/ExtractState.md)\<`S`\>; \<`T`\>(`selector`): `T`; \}

Defined in: [utils/createBoundedUseStore.ts:34](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/createBoundedUseStore.ts#L34)

Creates a React hook bound to a vanilla Zustand store, so components do not pass the store on every call.

The hook calls `useStore` from `zustand`, so it follows the rules of React hooks and needs `react` in the app. Call it
without arguments to subscribe to the whole state, or with a selector to subscribe to a slice. A selector that
returns a new object or array on every call (such as the transaction selectors) re-renders on every store update;
select stable values or memoize.

## Type Parameters

### S

`S` *extends* `StoreApi`\<`unknown`\>

The store type.

## Parameters

### store

`S`

The vanilla Zustand store, for example the result of `createPulsarStore`.

## Returns

A hook: `useBoundedStore()` returns the whole state, `useBoundedStore(selector)` returns the selected value.

\{(): [`ExtractState`](/packages/pulsar-core/type-aliases/ExtractState.md)\<`S`\>; \<`T`\>(`selector`): `T`; \}

## Example

```ts
const usePulsarStore = createBoundedUseStore(pulsarStore);
const executeTxAction = usePulsarStore((state) => state.executeTxAction);
```
