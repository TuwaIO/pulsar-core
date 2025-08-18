[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmAdapter()

> **evmAdapter**\<`T`\>(`config`, `appChains`): `undefined` \| \{ `checkAndInitializeTrackerInStore`: (`__namedParameters`) => `Promise`\<`void`\>; `checkChainForTx`: (`chainId`) => `Promise`\<`void`\>; `checkTransactionsTracker`: (`actionTxKey`, `walletType`) => `object`; \}

Defined in: [packages/pulsar-evm/src/adapters/evmAdapter.ts:10](https://github.com/TuwaIO/pulsar-core/blob/331a7d5f292c7c39ecb210370af8d2ac8b40c273/packages/pulsar-evm/src/adapters/evmAdapter.ts#L10)

## Type Parameters

### T

`T` *extends* `Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>

## Parameters

### config

`Config`

### appChains

`Chain`[]

## Returns

`undefined` \| \{ `checkAndInitializeTrackerInStore`: (`__namedParameters`) => `Promise`\<`void`\>; `checkChainForTx`: (`chainId`) => `Promise`\<`void`\>; `checkTransactionsTracker`: (`actionTxKey`, `walletType`) => `object`; \}
