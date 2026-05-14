[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# BeforeTxProcess

> **BeforeTxProcess** = () => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:249](https://github.com/TuwaIO/pulsar-core/blob/bf965952c66068de202a09f972957e7674b640f1/packages/pulsar-core/src/types.ts#L249)

Callback executed before Pulsar initializes or submits a transaction.

Throw an error from this function to block the transaction before `initialTx`, wallet interaction,
persistence, or remote synchronization starts.

## Returns

`Promise`\<`void`\> \| `void`
