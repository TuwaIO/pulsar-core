[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxActions

> **TxActions** = `Record`\<`string`, (...`args`) => `Promise`\<`unknown`\>\>

Defined in: [packages/pulsar-core/src/types.ts:168](https://github.com/TuwaIO/pulsar-core/blob/494f4105ae0c6206b7fb474bf50e2b00399fd8c0/packages/pulsar-core/src/types.ts#L168)

A registry of functions that can be re-executed, keyed by `actionKey`.
Used for implementing "Retry" functionality.
