[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<TR, T, A\>

> **TxAdapter**\<`TR`, `T`, `A`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:210](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L210)

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

Defined in: [packages/pulsar-core/src/types.ts:236](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L236)

Optional: Logic to cancel a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>

***

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:223](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L223)

Initializes the correct background tracker for a given transaction.

#### Parameters

##### params

`object` & `Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\>

#### Returns

`Promise`\<`void`\>

***

### checkChainForTx()

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:219](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L219)

Ensures the connected wallet is on the correct network for the transaction.

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

Defined in: [packages/pulsar-core/src/types.ts:221](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L221)

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

Defined in: [packages/pulsar-core/src/types.ts:234](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L234)

Optional: Fetches an avatar URL from a chain-specific name service.

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getExplorerTxUrl()?

> `optional` **getExplorerTxUrl**: (`transactionsPool`, `txKey`, `replacedTxHash?`) => `string`

Defined in: [packages/pulsar-core/src/types.ts:248](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L248)

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

Defined in: [packages/pulsar-core/src/types.ts:230](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L230)

Returns the base URL for the blockchain explorer.

#### Returns

`string` \| `undefined`

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:232](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L232)

Optional: Fetches a name from a chain-specific name service (e.g., ENS).

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getWalletInfo()

> **getWalletInfo**: () => `object`

Defined in: [packages/pulsar-core/src/types.ts:214](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L214)

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

Defined in: [packages/pulsar-core/src/types.ts:212](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L212)

The unique key identifying this adapter.

***

### retryTxAction()?

> `optional` **retryTxAction**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:240](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L240)

Optional: Logic to retry a failed transaction.

#### Parameters

##### params

`object` & `Partial`\<`Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`TR`, `T`, `A`\>, `"handleTransaction"`\>\>

#### Returns

`Promise`\<`void`\>

***

### speedUpTxAction()?

> `optional` **speedUpTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:238](https://github.com/TuwaIO/pulsar-core/blob/f8e82052c304404b9a8504de7ebd7c17c4293051/packages/pulsar-core/src/types.ts#L238)

Optional: Logic to speed up a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>
