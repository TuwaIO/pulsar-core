# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:791](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L791)

The configuration of `createTxInMemoryStore`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Properties

### getHistory?

> `optional` **getHistory?**: (`{
    page,
    walletAddress,
  }`) => `Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \} \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:813](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L813)

Loads one page of the remote history of a wallet. Return `null` when there is no history to show (for example,
the user is not signed in); throw on errors to set `isError`.

#### Parameters

##### \{
    page,
    walletAddress,
  \}

###### page?

`number`

Page number for pagination.

**Default Value**

`1`

###### walletAddress

`string`

The wallet whose history is requested.

#### Returns

`Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \} \| `null`\>

***

### isTxRemoved?

> `optional` **isTxRemoved?**: (`txKey`) => `boolean`

Defined in: [packages/pulsar-core/src/types.ts:800](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L800)

Usually `isTxRemoved` of the persistent store: the pending row of such a transaction is left out of the history, as nothing
tracks it any more, also after a page load. Once a page brings it finished, it shows.

#### Parameters

##### txKey

`string`

The key of the transaction.

#### Returns

`boolean`

Whether it was removed.

***

### localTransactionsPool

> **localTransactionsPool**: [`TransactionPool`](/packages/pulsar-core/type-aliases/TransactionPool.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:793](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L793)

The initial pool, usually `transactionsPool` of the persistent store.

***

### onHistoryFetched?

> `optional` **onHistoryFetched?**: (`remoteTxs`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:808](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L808)

Called in a microtask with the valid transactions of every loaded page, usually to pass them to the store's
`injectExternalPendingTxs`.

#### Parameters

##### remoteTxs

`T`[]

The transactions of the loaded page.

#### Returns

`void`

***

### reconcileUnsyncedTransactions?

> `optional` **reconcileUnsyncedTransactions?**: () => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:802](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L802)

Called by `fetchInitial` before the first page is loaded, usually the store's `reconcileUnsyncedTransactions`.

#### Returns

`Promise`\<`void`\>
