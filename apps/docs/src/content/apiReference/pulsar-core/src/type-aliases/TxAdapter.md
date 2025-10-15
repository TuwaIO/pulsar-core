[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<T\>

> **TxAdapter**\<`T`\> = `Pick`\<`BaseAdapter`, `"getExplorerUrl"`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:245](https://github.com/TuwaIO/pulsar-core/blob/0756e252e3a82162ff35197ca9c787a6a62b8731/packages/pulsar-core/src/types.ts#L245)

Defines the interface for a transaction adapter, which provides chain-specific logic and utilities.

## Type Declaration

### cancelTxAction()?

> `optional` **cancelTxAction**: (`tx`) => `Promise`\<`string`\>

Optional: Logic to cancel a pending EVM transaction.

#### Parameters

##### tx

`T`

The transaction to cancel.

#### Returns

`Promise`\<`string`\>

The new transaction hash for the cancellation.

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`params`) => `Promise`\<`void`\> \| `void`

Selects and initializes the correct background tracker for a given transaction.

#### Parameters

##### params

`object` & [`OnSuccessCallback`](OnSuccessCallback.md)\<`T`\> & `Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\>

The parameters for initializing the tracker, including the transaction and store callbacks.

#### Returns

`Promise`\<`void`\> \| `void`

### checkChainForTx()

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

Ensures the connected wallet is on the correct network for the transaction.

This method should throw an error if the chain is mismatched.

#### Parameters

##### chainId

The desired chain ID for the transaction.

`string` | `number`

#### Returns

`Promise`\<`void`\>

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

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

### getExplorerTxUrl()?

> `optional` **getExplorerTxUrl**: (`tx`) => `string`

Optional: Constructs a full explorer URL for a specific transaction.
May require the full transaction pool to resolve details for replaced transactions.

#### Parameters

##### tx

`T`

The transaction object.

#### Returns

`string`

The full URL to the transaction on the explorer.

### getWalletInfo()

> **getWalletInfo**: () => `object`

Returns information about the currently connected wallet.

#### Returns

##### walletAddress

> **walletAddress**: `string`

The currently connected wallet address.

##### walletType

> **walletType**: `string`

The type of the wallet (e.g., 'metamask', 'phantom').

### key

> **key**: `OrbitAdapter`

The unique key identifying this adapter.

### retryTxAction()?

> `optional` **retryTxAction**: (`params`) => `Promise`\<`void`\>

Optional: Logic to retry a failed transaction.

#### Parameters

##### params

`object` & `Partial`\<`Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`T`\>, `"executeTxAction"`\>\>

The parameters for retrying the transaction.

#### Returns

`Promise`\<`void`\>

### speedUpTxAction()?

> `optional` **speedUpTxAction**: (`tx`) => `Promise`\<`string`\>

Optional: Logic to speed up a pending EVM transaction.

#### Parameters

##### tx

`T`

The transaction to speed up.

#### Returns

`Promise`\<`string`\>

The new transaction hash for the sped-up transaction.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type, extending `Transaction`.
