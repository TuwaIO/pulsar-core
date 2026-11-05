# TrackerCallbacks\<T\>

Defined in: [types.ts:333](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L333)

Callbacks passed to `executeTxAction` and forwarded to the tracker of that transaction. They are not stored:
trackers restarted by `initializeTransactionsPool` or `injectExternalPendingTxs` (for example after a page reload)
run without them. Their return values are not awaited. For reactions that must also run after a reload, use the
`onTxFinished` option of `createPulsarStore` or `subscribeTxFinished` of the store: they run first, then these.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Properties

### onError?

> `optional` **onError?**: (`error`, `tx?`) => `Promise`\<`void`\> \| `void`

Defined in: [types.ts:344](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L344)

Called when the transaction fails: it reverted, was rejected, or tracking gave up.

#### Parameters

##### error

`unknown`

The raw error, or a generated `Error`.

##### tx?

`T`

The transaction after the update.

#### Returns

`Promise`\<`void`\> \| `void`

***

### onReplaced?

> `optional` **onReplaced?**: (`newTx`, `oldTx`) => `Promise`\<`void`\> \| `void`

Defined in: [types.ts:350](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L350)

Called when the transaction is replaced by another one with the same nonce.

#### Parameters

##### newTx

`T`

The tracked transaction after the update (`status: Replaced`, `replacedTxHash` set).

##### oldTx

`T`

The transaction as tracking started.

#### Returns

`Promise`\<`void`\> \| `void`

***

### onSuccess?

> `optional` **onSuccess?**: (`tx`) => `Promise`\<`void`\> \| `void`

Defined in: [types.ts:338](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L338)

Called when the tracker marks the transaction `Success`.

#### Parameters

##### tx

`T`

The transaction after the update.

#### Returns

`Promise`\<`void`\> \| `void`
