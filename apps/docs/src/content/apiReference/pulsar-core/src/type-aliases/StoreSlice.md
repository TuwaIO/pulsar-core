[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# StoreSlice()\<T, E\>

> **StoreSlice**\<`T`, `E`\> = (`set`, `get`) => `T`

Defined in: [packages/pulsar-core/src/types.ts:16](https://github.com/TuwaIO/pulsar-core/blob/1b4300a614d84f49e2f240cc8a629dd932f3f73b/packages/pulsar-core/src/types.ts#L16)

A utility type for creating modular Zustand store slices.

## Type Parameters

### T

`T` *extends* `object`

The state slice type.

### E

`E` *extends* `object` = `T`

The full store state type, defaults to T.

## Parameters

### set

`StoreApi`\<`E` *extends* `T` ? `E` : `E` & `T`\>\[`"setState"`\]

### get

`StoreApi`\<`E` *extends* `T` ? `E` : `E` & `T`\>\[`"getState"`\]

## Returns

`T`
