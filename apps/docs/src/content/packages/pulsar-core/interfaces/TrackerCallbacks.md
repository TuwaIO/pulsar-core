# TrackerCallbacks\<T\>

Defined in: [packages/pulsar-core/src/types.ts:332](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L332)

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

Defined in: [packages/pulsar-core/src/types.ts:344](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L344)

Called when the transaction fails: it reverted, was rejected, or tracking gave up. Also, with `status: Replaced`, for
another transaction in its nonce that reverted.

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

Defined in: [packages/pulsar-core/src/types.ts:352](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L352)

Called when the transaction is replaced by another one with the same nonce. After a speed-up (`replacedReason:
'repriced'`) the operation goes on: a new record tracks the new hash, and `onSuccess` or `onError` run for it.

#### Parameters

##### newTx

`T`

The tracked transaction after the update (`status: Replaced`, `replacedTxHash` set unless
`replacedReason` is `unknown`).

##### oldTx

`T`

The transaction as tracking started.

#### Returns

`Promise`\<`void`\> \| `void`

***

### onSuccess?

> `optional` **onSuccess?**: (`tx`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:337](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L337)

Called when the tracker marks the transaction `Success`.

#### Parameters

##### tx

`T`

The transaction after the update.

#### Returns

`Promise`\<`void`\> \| `void`
