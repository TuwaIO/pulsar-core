[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxActions

> **TxActions** = `Record`\<`string`, (...`args`) => `Promise`\<`unknown`\>\>

Defined in: [packages/pulsar-core/src/types.ts:164](https://github.com/TuwaIO/pulsar-core/blob/eacf1eb9ef4f00f2ac864ab92c14d4197d5c3ae1/packages/pulsar-core/src/types.ts#L164)

A registry of functions that can be re-executed, keyed by `actionKey`.
Used for implementing "Retry" functionality.
