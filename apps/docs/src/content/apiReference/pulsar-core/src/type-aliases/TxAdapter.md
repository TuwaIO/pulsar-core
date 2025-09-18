[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<T\>

> **TxAdapter**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:254](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L254)

Defines the interface for a transaction adapter, which provides chain-specific logic and utilities.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### cancelTxAction()?

> `optional` **cancelTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:281](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L281)

Optional: Logic to cancel a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>

***

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`params`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:270](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L270)

Selects and initializes the correct background tracker for a given transaction.

#### Parameters

##### params

`object` & [`OnSuccessCallback`](OnSuccessCallback.md)\<`T`\> & `Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\>

#### Returns

`Promise`\<`void`\> \| `void`

***

### checkChainForTx()

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:263](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L263)

Ensures the connected wallet is on the correct network for the transaction. Throws an error if the chain is mismatched.

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

Defined in: [packages/pulsar-core/src/types.ts:265](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L265)

Determines the appropriate tracker and final `txKey` from the result of an action.

#### Parameters

##### actionTxKey

[`ActionTxKey`](ActionTxKey.md)

##### walletType

`string`

#### Returns

`object`

##### tracker

> **tracker**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

##### txKey

> **txKey**: `string`

***

### getAvatar()?

> `optional` **getAvatar**: (`name`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:279](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L279)

Optional: Fetches an avatar URL from a chain-specific name service.

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getExplorerTxUrl()?

> `optional` **getExplorerTxUrl**: (`tx`) => `string`

Defined in: [packages/pulsar-core/src/types.ts:296](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L296)

Optional: Constructs a full explorer URL for a specific transaction.
May require the full transaction pool to resolve details for replaced transactions.

#### Parameters

##### tx

`T`

#### Returns

`string`

***

### getExplorerUrl()

> **getExplorerUrl**: (`url?`) => `string` \| `undefined`

Defined in: [packages/pulsar-core/src/types.ts:275](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L275)

Returns the base URL for the blockchain explorer for the current network.

#### Parameters

##### url?

`string`

#### Returns

`string` \| `undefined`

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:277](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L277)

Optional: Fetches a name from a chain-specific name service (e.g., ENS).

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getWalletInfo()

> **getWalletInfo**: () => `object`

Defined in: [packages/pulsar-core/src/types.ts:258](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L258)

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

Defined in: [packages/pulsar-core/src/types.ts:256](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L256)

The unique key identifying this adapter.

***

### retryTxAction()?

> `optional` **retryTxAction**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:285](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L285)

Optional: Logic to retry a failed transaction.

#### Parameters

##### params

`object` & `Partial`\<`Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`T`\>, `"handleTransaction"`\>\>

#### Returns

`Promise`\<`void`\>

***

### speedUpTxAction()?

> `optional` **speedUpTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:283](https://github.com/TuwaIO/pulsar-core/blob/bf6927ad9548f321243c3ca0256852e2339389ae/packages/pulsar-core/src/types.ts#L283)

Optional: Logic to speed up a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>
