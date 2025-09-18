[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<T\>

> **TxAdapter**\<`T`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:251](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L251)

Defines the interface for a transaction adapter, which provides chain-specific logic and utilities.

## Type Parameters

### T

`T` *extends* [`Transaction`](Transaction.md)

The specific transaction type, extending `Transaction`.

## Properties

### cancelTxAction()?

> `optional` **cancelTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:277](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L277)

Optional: Logic to cancel a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>

***

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:267](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L267)

Selects and initializes the correct background tracker for a given transaction.

#### Parameters

##### params

`object` & `Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`T`\>, `"updateTxParams"` \| `"removeTxFromPool"`\>

#### Returns

`Promise`\<`void`\>

***

### checkChainForTx()

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:260](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L260)

Ensures the connected wallet is on the correct network for the transaction. Throws an error if the chain is mismatched.

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

Defined in: [packages/pulsar-core/src/types.ts:262](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L262)

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

Defined in: [packages/pulsar-core/src/types.ts:275](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L275)

Optional: Fetches an avatar URL from a chain-specific name service.

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getExplorerTxUrl()?

> `optional` **getExplorerTxUrl**: (`tx`) => `string`

Defined in: [packages/pulsar-core/src/types.ts:292](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L292)

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

Defined in: [packages/pulsar-core/src/types.ts:271](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L271)

Returns the base URL for the blockchain explorer for the current network.

#### Parameters

##### url?

`string`

#### Returns

`string` \| `undefined`

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/pulsar-core/src/types.ts:273](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L273)

Optional: Fetches a name from a chain-specific name service (e.g., ENS).

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getWalletInfo()

> **getWalletInfo**: () => `object`

Defined in: [packages/pulsar-core/src/types.ts:255](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L255)

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

Defined in: [packages/pulsar-core/src/types.ts:253](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L253)

The unique key identifying this adapter.

***

### retryTxAction()?

> `optional` **retryTxAction**: (`params`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:281](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L281)

Optional: Logic to retry a failed transaction.

#### Parameters

##### params

`object` & `Partial`\<`Pick`\<[`ITxTrackingStore`](ITxTrackingStore.md)\<`T`\>, `"handleTransaction"`\>\>

#### Returns

`Promise`\<`void`\>

***

### speedUpTxAction()?

> `optional` **speedUpTxAction**: (`tx`) => `Promise`\<`string`\>

Defined in: [packages/pulsar-core/src/types.ts:279](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-core/src/types.ts#L279)

Optional: Logic to speed up a pending EVM transaction.

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`string`\>
