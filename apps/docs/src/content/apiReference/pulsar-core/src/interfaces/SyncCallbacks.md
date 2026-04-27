[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SyncCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:228](https://github.com/TuwaIO/pulsar-core/blob/ec1fbdb65038124be29ff74cedf250a5f8ff704f/packages/pulsar-core/src/types.ts#L228)

Callbacks for synchronizing local transaction state with a remote backend.
These are injected into the store at creation time.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

## Properties

### onRemoteCreate?

> `optional` **onRemoteCreate?**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:233](https://github.com/TuwaIO/pulsar-core/blob/ec1fbdb65038124be29ff74cedf250a5f8ff704f/packages/pulsar-core/src/types.ts#L233)

Called immediately after a transaction is created locally (added to pool).
Use this to POST the active pending transaction to the backend.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\>
