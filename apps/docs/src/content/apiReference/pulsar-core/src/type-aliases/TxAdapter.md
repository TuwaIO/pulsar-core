[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<TR, T, A\>

> **TxAdapter**\<`TR`, `T`, `A`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:193](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L193)

Represents the type for a transaction adapter which provides utilities for handling transaction-related operations.

## Type Parameters

### TR

`TR`

Represents the transaction tracker type.

### T

`T` *extends* [`Transaction`](Transaction.md)\<`TR`\>

Represents the type of the transaction, extending the base Transaction<TR>.

### A

`A`

Represents the type for the action transaction key.

## Properties

### cancelTxAction()?

> `optional` **cancelTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:211](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L211)

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>

***

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`{
    tx,
    ...rest
  }`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:203](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L203)

#### Parameters

##### \{
    tx,
    ...rest
  \}

`object` & `Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\>

#### Returns

`Promise`\<`void`\>

***

### checkChainForTx()

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:201](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L201)

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

Defined in: [packages/pulsar-core/src/types.ts:202](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L202)

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

Defined in: [packages/pulsar-core/src/types.ts:224](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L224)

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

Defined in: [packages/pulsar-core/src/types.ts:210](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L210)

#### Returns

`string` \| `undefined`

***

### getWalletInfo()

> **getWalletInfo**: () => `object`

Defined in: [packages/pulsar-core/src/types.ts:195](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L195)

#### Returns

##### walletAddress

> **walletAddress**: `string`

Wallet address.

##### walletType

> **walletType**: `string`

Type of the wallet. (injected, wallet connect, etc.)

***

### key

> **key**: [`TransactionAdapter`](../enumerations/TransactionAdapter.md)

Defined in: [packages/pulsar-core/src/types.ts:194](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L194)

***

### retryTxAction()?

> `optional` **retryTxAction**: (`{
    tx,
    actions,
    onClose,
    handleTransaction,
  }`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:213](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L213)

#### Parameters

##### \{
    tx,
    actions,
    onClose,
    handleTransaction,
  \}

`object` & `Partial`\<`Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `"handleTransaction"`\>\>

#### Returns

`Promise`\<`void`\>

***

### speedUpTxAction()?

> `optional` **speedUpTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:212](https://github.com/TuwaIO/pulsar-core/blob/acc55b8ea88c057dc85e11294b5f67ddd97fb9bb/packages/pulsar-core/src/types.ts#L212)

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>
