[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SyncCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:240](https://github.com/TuwaIO/pulsar-core/blob/519f4d89669ea26ac36d52c0628d99fc9619daf2/packages/pulsar-core/src/types.ts#L240)

Callbacks for synchronizing local transaction state with a remote backend.
These are injected into the store at creation time.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

## Properties

### onRemoteCreate()?

> `optional` **onRemoteCreate**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:245](https://github.com/TuwaIO/pulsar-core/blob/519f4d89669ea26ac36d52c0628d99fc9619daf2/packages/pulsar-core/src/types.ts#L245)

Called immediately after a transaction is created locally (added to pool).
Use this to POST the active pending transaction to the backend.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\>
