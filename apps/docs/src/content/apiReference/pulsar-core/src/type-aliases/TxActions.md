[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxActions

> **TxActions** = `Record`\<`string`, (...`args`) => `Promise`\<`unknown`\>\>

Defined in: [packages/pulsar-core/src/types.ts:147](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L147)

A registry of functions that can be re-executed via the 'Retry' button. The key should match `actionKey` on a transaction.
