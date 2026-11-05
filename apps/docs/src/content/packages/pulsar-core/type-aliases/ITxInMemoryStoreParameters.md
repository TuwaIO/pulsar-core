# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:778](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L778)

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

Defined in: [packages/pulsar-core/src/types.ts:793](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L793)

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

Defined in: [packages/pulsar-core/src/types.ts:780](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L780)

The initial pool, usually `transactionsPool` of the persistent store.

***

### onHistoryFetched?

> `optional` **onHistoryFetched?**: (`remoteTxs`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:788](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L788)

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

Defined in: [packages/pulsar-core/src/types.ts:782](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L782)

Called by `fetchInitial` before the first page is loaded, usually the store's `reconcileUnsyncedTransactions`.

#### Returns

`Promise`\<`void`\>
