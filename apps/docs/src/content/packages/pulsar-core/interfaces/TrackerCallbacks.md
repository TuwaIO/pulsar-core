# TrackerCallbacks\<T\>

Defined in: [types.ts:298](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L298)

Callbacks passed to `executeTxAction` and forwarded to the tracker of that transaction. They are not stored:
trackers restarted by `initializeTransactionsPool` or `injectExternalPendingTxs` (for example after a page reload)
run without them. Their return values are not awaited.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Properties

### onError?

> `optional` **onError?**: (`error`, `tx?`) => `Promise`\<`void`\> \| `void`

Defined in: [types.ts:309](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L309)

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

Defined in: [types.ts:315](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L315)

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

Defined in: [types.ts:303](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L303)

Called when the tracker marks the transaction `Success`.

#### Parameters

##### tx

`T`

The transaction after the update.

#### Returns

`Promise`\<`void`\> \| `void`
