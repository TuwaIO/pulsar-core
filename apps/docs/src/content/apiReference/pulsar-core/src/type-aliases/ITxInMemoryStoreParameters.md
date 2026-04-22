[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ITxInMemoryStoreParameters\<T\>

> **ITxInMemoryStoreParameters**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:489](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L489)

Parameters used to configure and manage an in-memory transaction store.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The transaction type.

## Properties

### getHistory()?

> `optional` **getHistory**: (`{
    page,
    walletAddress,
  }`) => `Promise`\<\{ `docs`: `T`[]; `hasNextPage`: `boolean`; `hasPrevPage`: `boolean`; `page`: `number`; `totalDocs`: `number`; `totalPages`: `number`; \} \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:496](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L496)

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

Defined in: [packages/pulsar-core/src/types.ts:491](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L491)

A localTransactionsPool.

***

### onHistoryFetched()?

> `optional` **onHistoryFetched**: (`remoteTxs`) => `void`

Defined in: [packages/pulsar-core/src/types.ts:495](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L495)

Callback fired when remote history is successfully fetched.
Used to inject remote pending transactions into the persistent tracking store.

#### Parameters

##### remoteTxs

`T`[]

#### Returns

`void`
