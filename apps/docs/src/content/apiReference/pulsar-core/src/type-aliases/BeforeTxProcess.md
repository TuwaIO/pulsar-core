[**API Reference.**](../../../README.md)

***

# BeforeTxProcess

> **BeforeTxProcess** = () => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:252](https://github.com/TuwaIO/pulsar-core/blob/3dc4a6cf92ff800817c9254f1839b404b495b304/packages/pulsar-core/src/types.ts#L252)

Callback executed before Pulsar initializes or submits a transaction.

Throw an error from this function to block the transaction before `initialTx`, wallet interaction,
persistence, or remote synchronization starts.

## Returns

`Promise`\<`void`\> \| `void`
