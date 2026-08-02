[**API Reference.**](../../../README.md)

***

# BeforeTxProcess

> **BeforeTxProcess** = () => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:252](https://github.com/TuwaIO/pulsar-core/blob/61d8f47844d57c138581e481416b47757f9283c6/packages/pulsar-core/src/types.ts#L252)

Callback executed before Pulsar initializes or submits a transaction.

Throw an error from this function to block the transaction before `initialTx`, wallet interaction,
persistence, or remote synchronization starts.

## Returns

`Promise`\<`void`\> \| `void`
