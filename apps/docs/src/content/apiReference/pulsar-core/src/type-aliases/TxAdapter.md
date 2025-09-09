[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<TR, T, A\>

> **TxAdapter**\<`TR`, `T`, `A`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:212](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L212)

Defines the interface for a transaction adapter, which provides chain-specific logic and utilities.

## Type Parameters

### TR

`TR`

The type of the tracker identifier (e.g., a string enum).

### T

`T` *extends* [`Transaction`](Transaction.md)\<`TR`\>

The specific transaction type, extending `Transaction<TR>`.

### A

`A`

The type of the key returned by the `actionFunction` (e.g., a transaction hash).

## Properties

### cancelTxAction()?

> `optional` **cancelTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:234](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L234)

Optional: Logic to cancel a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>

***

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:225](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L225)

Initializes the correct background tracker for a given transaction.

#### Parameters

##### params

`object` & `Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\>

#### Returns

`Promise`\<`void`\>

***

### checkChainForTx()

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:221](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L221)

Ensures the connected wallet is on the correct network for the transaction.

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

Defined in: [packages/pulsar-core/src/types.ts:223](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L223)

Determines the appropriate tracker and final `txKey` based on the result of an action.

#### Parameters

##### actionTxKey

`A`

##### walletType

`string`

#### Returns

`object`

##### tracker

> **tracker**: `TR`

##### txKey

> **txKey**: `string`

***

### getExplorerTxUrl()?

> `optional` **getExplorerTxUrl**: (`transactionsPool`, `txKey`, `replacedTxHash?`) => `string`

Defined in: [packages/pulsar-core/src/types.ts:247](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L247)

Optional: Constructs a full explorer URL for a specific transaction.

#### Parameters

##### transactionsPool

[`TransactionPool`](TransactionPool.md)\<`TR`, `T`\>

##### txKey

`string`

##### replacedTxHash?

`string`

#### Returns

`string`

***

### getExplorerUrl()

> **getExplorerUrl**: () => `string` \| `undefined`

Defined in: [packages/pulsar-core/src/types.ts:232](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L232)

Returns the base URL for the blockchain explorer.

#### Returns

`string` \| `undefined`

***

### getWalletInfo()

> **getWalletInfo**: () => `object`

Defined in: [packages/pulsar-core/src/types.ts:216](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L216)

Returns information about the currently connected wallet.

#### Returns

`object`

##### walletAddress

> **walletAddress**: `string`

##### walletType

> **walletType**: `string`

***

### key

> **key**: [`TransactionAdapter`](../enumerations/TransactionAdapter.md)

Defined in: [packages/pulsar-core/src/types.ts:214](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L214)

The unique key identifying this adapter.

***

### retryTxAction()?

> `optional` **retryTxAction**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:238](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L238)

Optional: Logic to retry a failed transaction.

#### Parameters

##### params

`object` & `Partial`\<`Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `"handleTransaction"`\>\>

#### Returns

`Promise`\<`void`\>

***

### speedUpTxAction()?

> `optional` **speedUpTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:236](https://github.com/TuwaIO/pulsar-core/blob/6f58c3c9fd82323ffe7018d4cd8562c3905e9a91/packages/pulsar-core/src/types.ts#L236)

Optional: Logic to speed up a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>
