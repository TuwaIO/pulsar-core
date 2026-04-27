[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SyncCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:226](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-core/src/types.ts#L226)

Callbacks for synchronizing local transaction state with a remote backend.
These are injected into the store at creation time.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

## Properties

### onRemoteCreate?

> `optional` **onRemoteCreate?**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:231](https://github.com/TuwaIO/pulsar-core/blob/1c91d65eda8baf365ba3ddea0556929964753b54/packages/pulsar-core/src/types.ts#L231)

Called immediately after a transaction is created locally (added to pool).
Use this to POST the active pending transaction to the backend.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\>
