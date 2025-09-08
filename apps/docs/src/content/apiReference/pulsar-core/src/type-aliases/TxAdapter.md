[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<TR, T, A\>

> **TxAdapter**\<`TR`, `T`, `A`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:190](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L190)

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

### cancelTxAction()

> **cancelTxAction**: (`tx`) => `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/pulsar-core/src/types.ts:207](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L207)

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`` `0x${string}` ``\>

***

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`{
    tx,
    ...rest
  }`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:200](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L200)

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

Defined in: [packages/pulsar-core/src/types.ts:198](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L198)

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

Defined in: [packages/pulsar-core/src/types.ts:199](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L199)

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

### explorerLink()

> **explorerLink**: (`transactionsPool`, `txKey`, `replacedTxHash?`) => `string`

Defined in: [packages/pulsar-core/src/types.ts:209](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L209)

#### Parameters

##### transactionsPool

[`TransactionPool`](TransactionPool.md)\<`TR`, `T`\>

##### txKey

`` `0x${string}` ``

##### replacedTxHash?

`` `0x${string}` ``

#### Returns

`string`

***

### getWalletInfo()

> **getWalletInfo**: () => `object`

Defined in: [packages/pulsar-core/src/types.ts:192](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L192)

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

Defined in: [packages/pulsar-core/src/types.ts:191](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L191)

***

### speedUpTxAction()

> **speedUpTxAction**: (`tx`) => `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/pulsar-core/src/types.ts:208](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L208)

#### Parameters

##### tx

`T`

#### Returns

`Promise`\<`` `0x${string}` ``\>
