[**API Reference.**](../../../README.md)

***

# SyncCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:236](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/types.ts#L236)

Callbacks for synchronizing local transaction state with a remote backend.
These are injected into the store at creation time.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

## Properties

### onRemoteCreate?

> `optional` **onRemoteCreate?**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:241](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/types.ts#L241)

Called immediately after a transaction is created locally (added to pool).
Use this to POST the active pending transaction to the backend.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\>
