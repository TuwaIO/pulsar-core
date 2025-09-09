[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxActions

> **TxActions** = `Record`\<`string`, (...`args`) => `Promise`\<`unknown`\>\>

Defined in: [packages/pulsar-core/src/types.ts:164](https://github.com/TuwaIO/pulsar-core/blob/3307a45a24b5cbed98dc52a5d0d9d419fa72f5c9/packages/pulsar-core/src/types.ts#L164)

A registry of functions that can be re-executed, keyed by `actionKey`.
Used for implementing "Retry" functionality.
