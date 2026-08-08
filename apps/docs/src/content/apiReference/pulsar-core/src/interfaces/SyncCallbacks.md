[**API Reference.**](../../../README.md)

***

# SyncCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:238](https://github.com/TuwaIO/pulsar-core/blob/819c1d985f271976d4b4810e53af195599d5e021/packages/pulsar-core/src/types.ts#L238)

Callbacks for synchronizing local transaction state with a remote backend.
These are injected into the store at creation time.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

## Properties

### onRemoteCreate?

> `optional` **onRemoteCreate?**: (`tx`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:243](https://github.com/TuwaIO/pulsar-core/blob/819c1d985f271976d4b4810e53af195599d5e021/packages/pulsar-core/src/types.ts#L243)

Called immediately after a transaction is created locally (added to pool).
Use this to POST the active pending transaction to the backend.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`void`\>
