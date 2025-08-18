[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmAdapter()

> **evmAdapter**\<`T`\>(`config`, `appChains`): `object`

Defined in: [packages/pulsar-evm/src/adapters/evmAdapter.ts:10](https://github.com/TuwaIO/pulsar-core/blob/720ae68e888aeb5b19c59753a144a246fe05cc4c/packages/pulsar-evm/src/adapters/evmAdapter.ts#L10)

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

## Parameters

### config

`Config`

### appChains

`Chain`[]

## Returns

`object`

### checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**: (`__namedParameters`) => `Promise`\<`void`\>

#### Parameters

##### \_\_namedParameters

`object` & `Pick`\<`ITxTrackingStore`\<[`TransactionTracker`](../enumerations/TransactionTracker.md), `T`, [`ActionTxKey`](../type-aliases/ActionTxKey.md)\>, `"transactionsPool"` \| `"updateTxParams"` \| `"onSucceedCallbacks"` \| `"removeTxFromPool"`\>

#### Returns

`Promise`\<`void`\>

### checkChainForTx()

> **checkChainForTx**: (`chainId`) => `Promise`\<`void`\>

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

### checkTransactionsTracker()

> **checkTransactionsTracker**: (`actionTxKey`, `walletType`) => `object`

#### Parameters

##### actionTxKey

[`ActionTxKey`](../type-aliases/ActionTxKey.md)

##### walletType

`string`

#### Returns

`object`

##### tracker

> **tracker**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

##### txKey

> **txKey**: `string`
