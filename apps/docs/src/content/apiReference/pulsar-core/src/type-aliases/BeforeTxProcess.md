[**API Reference.**](../../../README.md)

***

# BeforeTxProcess

> **BeforeTxProcess** = () => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:252](https://github.com/TuwaIO/pulsar-core/blob/819c1d985f271976d4b4810e53af195599d5e021/packages/pulsar-core/src/types.ts#L252)

Callback executed before Pulsar initializes or submits a transaction.

Throw an error from this function to block the transaction before `initialTx`, wallet interaction,
persistence, or remote synchronization starts.

## Returns

`Promise`\<`void`\> \| `void`
