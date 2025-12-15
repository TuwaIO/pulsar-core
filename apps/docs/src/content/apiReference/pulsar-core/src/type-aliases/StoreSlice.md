[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StoreSlice()\<T, S\>

> **StoreSlice**\<`T`, `S`\> = (`set`, `get`) => `T`

Defined in: [packages/pulsar-core/src/types.ts:9](https://github.com/TuwaIO/pulsar-core/blob/a4bfce3dc18659d5c430d745b61e38318d9e8404/packages/pulsar-core/src/types.ts#L9)

A utility type for creating modular Zustand store slices, enabling composable state management.

## Type Parameters

### T

`T` *extends* `object`

The state slice being defined.

### S

`S` *extends* `object` = `T`

The full store state that includes the slice `T`.

## Parameters

### set

`StoreApi`\<`S` *extends* `T` ? `S` : `S` & `T`\>\[`"setState"`\]

### get

`StoreApi`\<`S` *extends* `T` ? `S` : `S` & `T`\>\[`"getState"`\]

## Returns

`T`
