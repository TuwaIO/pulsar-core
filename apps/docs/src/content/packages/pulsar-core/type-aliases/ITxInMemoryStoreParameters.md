# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [types.ts:748](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L748)

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

Defined in: [types.ts:763](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L763)

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

### localTransactionsPool

> **localTransactionsPool**: [`TransactionPool`](/packages/pulsar-core/type-aliases/TransactionPool.md)\<`T`\>

Defined in: [types.ts:750](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L750)

The initial pool, usually `transactionsPool` of the persistent store.

***

### onHistoryFetched?

> `optional` **onHistoryFetched?**: (`remoteTxs`) => `void`

Defined in: [types.ts:758](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L758)

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

Defined in: [types.ts:752](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L752)

Called by `fetchInitial` before the first page is loaded, usually the store's `reconcileUnsyncedTransactions`.

#### Returns

`Promise`\<`void`\>
