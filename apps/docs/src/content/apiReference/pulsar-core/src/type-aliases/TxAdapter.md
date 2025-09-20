[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<T\>

> **TxAdapter**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:273](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L273)

Defines the interface for a transaction adapter, which provides chain-specific logic and utilities.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### cancelTxAction()?

> `optional` **cancelTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:328](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L328)

Optional: Logic to cancel a pending EVM transaction.

#### Parameters

##### tx

`T`

The transaction to cancel.

#### Returns

`Promise`\<`string`\>

The new transaction hash for the cancellation.

***

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`params`) => `Promise`\<`void`\> \| `void`

Defined in: [packages/pulsar-core/src/types.ts:304](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L304)

Selects and initializes the correct background tracker for a given transaction.

#### Parameters

##### params

`object` & [`OnSuccessCallback`](OnSuccessCallback.md)\<`T`\> & `Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\>

The parameters for initializing the tracker, including the transaction and store callbacks.

#### Returns

`Promise`\<`void`\> \| `void`

***

### checkChainForTx()

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:289](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L289)

Ensures the connected wallet is on the correct network for the transaction.

This method should throw an error if the chain is mismatched.

#### Parameters

##### chainId

The desired chain ID for the transaction.

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

Defined in: [packages/pulsar-core/src/types.ts:296](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L296)

Determines the appropriate tracker and final `txKey` from the result of an action.

#### Parameters

##### actionTxKey

[`ActionTxKey`](ActionTxKey.md)

The preliminary key returned after an action function is executed.

##### walletType

`string`

The type of wallet used for the transaction.

#### Returns

`object`

An object containing the final `txKey` and the `TransactionTracker` to be used.

##### tracker

> **tracker**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

##### txKey

> **txKey**: `string`

***

### getAvatar()?

> `optional` **getAvatar**: (`name`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:322](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L322)

Optional: Fetches an avatar URL from a chain-specific name service.

#### Parameters

##### name

`string`

The name to resolve the avatar for.

#### Returns

`Promise`\<`string` \| `null`\>

***

### getExplorerTxUrl()?

> `optional` **getExplorerTxUrl**: (`tx`) => `string`

Defined in: [packages/pulsar-core/src/types.ts:355](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L355)

Optional: Constructs a full explorer URL for a specific transaction.
May require the full transaction pool to resolve details for replaced transactions.

#### Parameters

##### tx

`T`

The transaction object.

#### Returns

`string`

The full URL to the transaction on the explorer.

***

### getExplorerUrl()

> **getExplorerUrl**: (`url?`) => `string` \| `undefined`

Defined in: [packages/pulsar-core/src/types.ts:312](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L312)

Returns the base URL for the blockchain explorer for the current network.

#### Parameters

##### url?

`string`

Optional URL to override the default explorer URL.

#### Returns

`string` \| `undefined`

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:317](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L317)

Optional: Fetches a name from a chain-specific name service (e.g., ENS).

#### Parameters

##### address

`string`

The address to resolve the name for.

#### Returns

`Promise`\<`string` \| `null`\>

***

### getWalletInfo()

> **getWalletInfo**: () => `object`

Defined in: [packages/pulsar-core/src/types.ts:277](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L277)

Returns information about the currently connected wallet.

#### Returns

##### walletAddress

> **walletAddress**: `string`

The currently connected wallet address.

##### walletType

> **walletType**: `string`

The type of the wallet (e.g., 'metamask', 'phantom').

***

### key

> **key**: [`TransactionAdapter`](../enumerations/TransactionAdapter.md)

Defined in: [packages/pulsar-core/src/types.ts:275](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L275)

The unique key identifying this adapter.

***

### retryTxAction()?

> `optional` **retryTxAction**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:342](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L342)

Optional: Logic to retry a failed transaction.

#### Parameters

##### params

`object` & `Partial`\<`Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`T`\>, `"handleTransaction"`\>\>

The parameters for retrying the transaction.

#### Returns

`Promise`\<`void`\>

***

### speedUpTxAction()?

> `optional` **speedUpTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:334](https://github.com/TuwaIO/pulsar-core/blob/5b62bcb03f6eb32e89bac66553fb0e9e924d55a1/packages/pulsar-core/src/types.ts#L334)

Optional: Logic to speed up a pending EVM transaction.

#### Parameters

##### tx

`T`

The transaction to speed up.

#### Returns

`Promise`\<`string`\>

The new transaction hash for the sped-up transaction.
