[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<TR, T, A\>

> **TxAdapter**\<`TR`, `T`, `A`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:218](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L218)

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

Defined in: [packages/pulsar-core/src/types.ts:244](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L244)

Optional: Logic to cancel a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>

***

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:231](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L231)

Initializes the correct background tracker for a given transaction.

#### Parameters

##### params

`object` & `Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\>

#### Returns

`Promise`\<`void`\>

***

### checkChainForTx()

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:227](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L227)

Ensures the connected wallet is on the correct network for the transaction.

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

Defined in: [packages/pulsar-core/src/types.ts:229](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L229)

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

### getAvatar()?

> `optional` **getAvatar**: (`name`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:242](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L242)

Optional: Fetches an avatar URL from a chain-specific name service.

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getExplorerTxUrl()?

> `optional` **getExplorerTxUrl**: (`transactionsPool`, `txKey`, `replacedTxHash?`) => `string`

Defined in: [packages/pulsar-core/src/types.ts:257](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L257)

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

Defined in: [packages/pulsar-core/src/types.ts:238](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L238)

Returns the base URL for the blockchain explorer.

#### Returns

`string` \| `undefined`

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:240](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L240)

Optional: Fetches a name from a chain-specific name service (e.g., ENS).

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getWalletInfo()

> **getWalletInfo**: () => `object`

Defined in: [packages/pulsar-core/src/types.ts:222](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L222)

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

Defined in: [packages/pulsar-core/src/types.ts:220](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L220)

The unique key identifying this adapter.

***

### retryTxAction()?

> `optional` **retryTxAction**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:248](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L248)

Optional: Logic to retry a failed transaction.

#### Parameters

##### params

`object` & `Partial`\<`Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `"handleTransaction"`\>\>

#### Returns

`Promise`\<`void`\>

***

### speedUpTxAction()?

> `optional` **speedUpTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:246](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L246)

Optional: Logic to speed up a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>
