[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createBoundedUseStore()

> `const` **createBoundedUseStore**: \<`S`\>(`store`) => \{(): `ExtractState`\<`S`\>; \<`T`\>(`selector`): `T`; \}

Defined in: [packages/pulsar-core/src/utils/createBoundedUseStore.ts:25](https://github.com/TuwaIO/pulsar-core/blob/28bb913b1a980ea920f676d0d10844e9857d09c8/packages/pulsar-core/src/utils/createBoundedUseStore.ts#L25)

Creates a bounded `useStore` hook from a vanilla Zustand store instance.
The returned hook is fully typed and can be used with or without a selector.

## Type Parameters

### S

`S` *extends* `StoreApi`\<`unknown`\>

The type of the Zustand store (`StoreApi`).

## Parameters

### store

`S`

The vanilla Zustand store instance.

## Returns

A hook that can be called with an optional selector function.
- When called with a selector (`useBoundedStore(state => state.someValue)`), it returns the selected slice of the state.

> (): `ExtractState`\<`S`\>

### Returns

`ExtractState`\<`S`\>

> \<`T`\>(`selector`): `T`

### Type Parameters

#### T

`T`

### Parameters

#### selector

(`state`) => `T`

### Returns

`T`
