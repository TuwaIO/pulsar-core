[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StoreSlice()\<T, S\>

> **StoreSlice**\<`T`, `S`\> = (`set`, `get`) => `T`

Defined in: [packages/pulsar-core/src/types.ts:18](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L18)

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
