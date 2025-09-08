[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxActions

> **TxActions** = `Record`\<`string`, (...`args`) => `Promise`\<`unknown`\>\>

Defined in: [packages/pulsar-core/src/types.ts:147](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L147)

A registry of functions that can be re-executed via the 'Retry' button. The key should match `actionKey` on a transaction.
