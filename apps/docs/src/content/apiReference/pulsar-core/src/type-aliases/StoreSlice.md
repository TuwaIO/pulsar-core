[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StoreSlice()\<T, S\>

> **StoreSlice**\<`T`, `S`\> = (`set`, `get`) => `T`

Defined in: [packages/pulsar-core/src/types.ts:20](https://github.com/TuwaIO/pulsar-core/blob/6809762408e3f6b3c6a6abf36acf33e3e88891f1/packages/pulsar-core/src/types.ts#L20)

A utility type for creating modular Zustand store slices, enabling composable state management.

## Type Parameters

### T

`T` *extends* `object`

The type of the state slice.

### S

`S` *extends* `object` = `T`

The type of the full store state, defaulting to T.

## Parameters

### set

`StoreApi`\<`S` *extends* `T` ? `S` : `S` & `T`\>\[`"setState"`\]

### get

`StoreApi`\<`S` *extends* `T` ? `S` : `S` & `T`\>\[`"getState"`\]

## Returns

`T`
