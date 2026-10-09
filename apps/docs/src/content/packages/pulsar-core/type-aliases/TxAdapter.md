# TxAdapter\<T\>

> **TxAdapter**\<`T`\> = `Pick`\<`BaseAdapter`, `"getExplorerUrl"`\> & `object`

Defined in: [types.ts:399](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L399)

The contract a chain adapter implements to plug into the Pulsar store. `@tuwaio/pulsar-evm` and
`@tuwaio/pulsar-solana` provide implementations.

## Type Declaration

### cancelTxAction?

> `optional` **cancelTxAction?**: (`tx`) => `Promise`\<`string`\>

Optional: cancels a pending transaction by sending a replacement with the same nonce.

#### Parameters

##### tx

`T`

The transaction to cancel.

#### Returns

`Promise`\<`string`\>

The hash of the cancellation transaction.

### checkAndInitializeTrackerInStore

> **checkAndInitializeTrackerInStore**: (`params`) => `Promise`\<`void`\> \| `void`

Starts the background tracker of a transaction. Trackers update the transaction through `updateTxParams`. The
built-in trackers keep failed transactions in the pool; `removeTxFromPool` is available to custom trackers.

#### Parameters

##### params

`object` & [`TrackerCallbacks`](/packages/pulsar-core/interfaces/TrackerCallbacks.md)\<`T`\> & `Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"` \| `"transactionsPool"`\>

The transaction, the Gelato API key, the callbacks and the store members used by trackers.

#### Returns

`Promise`\<`void`\> \| `void`

### checkChainForTx

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

Ensures the wallet is on the chain of the transaction, switching it if the adapter can. Rejects when the chain
does not match, which aborts `executeTxAction`.

#### Parameters

##### chainId

`string` \| `number`

The `desiredChainID` of the transaction.

#### Returns

`Promise`\<`void`\>

### checkTransactionsTracker

> **checkTransactionsTracker**: (`params`) => `object`

Picks the tracker and the final `txKey` for the key returned by `actionFunction`.

#### Parameters

##### params

[`CheckTxTracker`](/packages/pulsar-core/type-aliases/CheckTxTracker.md)

The returned key, the connector type and the requested tracker.

#### Returns

The `txKey` to store the transaction under and the tracker to use.

##### tracker

> **tracker**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

The tracker that monitors the transaction.

##### txKey

> **txKey**: `string`

The key the transaction is stored under.

### getConnectorInfo

> **getConnectorInfo**: () => `object`

Returns the connected wallet. Called by `executeTxAction` before the chain check.

#### Returns

##### connectorType

> **connectorType**: `string`

The connector type, for example `evm:metamask`.

##### walletAddress

> **walletAddress**: `string`

The address of the connected wallet.

### getExplorerTxUrl?

> `optional` **getExplorerTxUrl?**: (`tx`) => `string`

Optional: builds the explorer URL of a transaction.

#### Parameters

##### tx

`T`

The transaction.

#### Returns

`string`

The URL, or an empty string when it cannot be built.

### key

> **key**: `OrbitAdapter`

The chain family handled by the adapter.

### retryTxAction?

> `optional` **retryTxAction?**: (`params`) => `Promise`\<`void`\>

Optional: closes the tracking modal and runs a failed transaction again through `executeTxAction`.

#### Parameters

##### params

`object` & `Partial`\<`Pick`\<[`ITxTrackingStore`](/packages/pulsar-core/type-aliases/ITxTrackingStore.md)\<`T`\>, `"executeTxAction"`\>\>

The retry parameters.

#### Returns

`Promise`\<`void`\>

### speedUpTxAction?

> `optional` **speedUpTxAction?**: (`tx`) => `Promise`\<`string`\>

Optional: speeds up a pending transaction by resending it with the same nonce and higher fees.

#### Parameters

##### tx

`T`

The transaction to speed up.

#### Returns

`Promise`\<`string`\>

The hash of the replacement transaction.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.
