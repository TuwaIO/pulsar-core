[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SyncCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:240](https://github.com/TuwaIO/pulsar-core/blob/51589730a9ca7f3b2a638b0d259ba38ebb76cdb1/packages/pulsar-core/src/types.ts#L240)

Callbacks for synchronizing local transaction state with a remote backend.
These are injected into the store at creation time.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

## Properties

### onRemoteCreate()?

> `optional` **onRemoteCreate**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:245](https://github.com/TuwaIO/pulsar-core/blob/51589730a9ca7f3b2a638b0d259ba38ebb76cdb1/packages/pulsar-core/src/types.ts#L245)

Called immediately after a transaction is created locally (added to pool).
Use this to POST the active pending transaction to the backend.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\>

***

### onRemoteUpdate()?

> `optional` **onRemoteUpdate**: (`txKey`, `patches`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:251](https://github.com/TuwaIO/pulsar-core/blob/51589730a9ca7f3b2a638b0d259ba38ebb76cdb1/packages/pulsar-core/src/types.ts#L251)

Called whenever a transaction's properties are updated (e.g. status change, new block data).
Use this to PATCH the transaction on the backend.

#### Parameters

##### txKey

`string`

##### patches

[`UpdatableTransactionFields`](../type-aliases/UpdatableTransactionFields.md)

#### Returns

`Promise`\<`void`\>
