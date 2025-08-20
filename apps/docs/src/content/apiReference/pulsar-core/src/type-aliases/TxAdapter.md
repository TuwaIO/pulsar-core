[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TxAdapter\<TR, T, A\>

> **TxAdapter**\<`TR`, `T`, `A`\> = `object`

Defined in: [packages/pulsar-core/src/types.ts:183](https://github.com/TuwaIO/pulsar-core/blob/3dd99361d439c3516b34d795b4c0fe6affcc943c/packages/pulsar-core/src/types.ts#L183)

## Type Parameters

### TR

`TR`

### T

`T` *extends* [`Transaction`](Transaction.md)\<`TR`\>

### A

`A`

## Properties

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`{
    tx,
    ...rest
  }`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-core/src/types.ts:193](https://github.com/TuwaIO/pulsar-core/blob/3dd99361d439c3516b34d795b4c0fe6affcc943c/packages/pulsar-core/src/types.ts#L193)

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

Defined in: [packages/pulsar-core/src/types.ts:191](https://github.com/TuwaIO/pulsar-core/blob/3dd99361d439c3516b34d795b4c0fe6affcc943c/packages/pulsar-core/src/types.ts#L191)

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

Defined in: [packages/pulsar-core/src/types.ts:192](https://github.com/TuwaIO/pulsar-core/blob/3dd99361d439c3516b34d795b4c0fe6affcc943c/packages/pulsar-core/src/types.ts#L192)

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

### getWalletInfo()

> **getWalletInfo**: () => `object`

Defined in: [packages/pulsar-core/src/types.ts:185](https://github.com/TuwaIO/pulsar-core/blob/3dd99361d439c3516b34d795b4c0fe6affcc943c/packages/pulsar-core/src/types.ts#L185)

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

Defined in: [packages/pulsar-core/src/types.ts:184](https://github.com/TuwaIO/pulsar-core/blob/3dd99361d439c3516b34d795b4c0fe6affcc943c/packages/pulsar-core/src/types.ts#L184)
