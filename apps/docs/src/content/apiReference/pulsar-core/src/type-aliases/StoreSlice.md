[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StoreSlice()\<T, S\>

> **StoreSlice**\<`T`, `S`\> = (`set`, `get`) => `T`

Defined in: [packages/pulsar-core/src/types.ts:20](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L20)

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
