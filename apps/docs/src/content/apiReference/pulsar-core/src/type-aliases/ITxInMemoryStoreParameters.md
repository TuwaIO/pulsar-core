[**API Reference.**](../../../README.md)

***

# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:521](https://github.com/TuwaIO/pulsar-core/blob/819c1d985f271976d4b4810e53af195599d5e021/packages/pulsar-core/src/types.ts#L521)

Parameters used to configure and manage an in-memory transaction store.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.

## Properties

### getHistory?

> `optional` **getHistory?**: (`{
    page,
    walletAddress,
  }`) => `Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \} \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:533](https://github.com/TuwaIO/pulsar-core/blob/819c1d985f271976d4b4810e53af195599d5e021/packages/pulsar-core/src/types.ts#L533)

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

#### Returns

`Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \} \| `null`\>

***

### localTransactionsPool

> **localTransactionsPool**: [`TransactionPool`](TransactionPool.md)\<`T`\>

Defined in: [packages/pulsar-core/src/types.ts:523](https://github.com/TuwaIO/pulsar-core/blob/819c1d985f271976d4b4810e53af195599d5e021/packages/pulsar-core/src/types.ts#L523)

A localTransactionsPool.

***

### onHistoryFetched?

> `optional` **onHistoryFetched?**: (`remoteTxs`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:532](https://github.com/TuwaIO/pulsar-core/blob/819c1d985f271976d4b4810e53af195599d5e021/packages/pulsar-core/src/types.ts#L532)

Callback fired when remote history is successfully fetched.
Used to inject remote pending transactions into the persistent tracking store.

#### Parameters

##### remoteTxs

`T`[]

#### Returns

`void`

***

### reconcileUnsyncedTransactions?

> `optional` **reconcileUnsyncedTransactions?**: () => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:528](https://github.com/TuwaIO/pulsar-core/blob/819c1d985f271976d4b4810e53af195599d5e021/packages/pulsar-core/src/types.ts#L528)

Attempts to synchronize any transactions in `unsyncedTxKeys` that have reached a terminal
status but failed their initial `onRemoteCreate` call.

#### Returns

`Promise`\<`void`\>
