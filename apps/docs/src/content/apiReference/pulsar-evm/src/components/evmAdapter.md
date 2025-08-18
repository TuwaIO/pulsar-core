[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmAdapter()

> **evmAdapter**\<`T`\>(`config`, `appChains`): `undefined` \| \{ `checkAndInitializeTrackerInStore`: (`__namedParameters`) => `Promise`\<`void`\>; `checkChainForTx`: (`chainId`) => `Promise`\<`void`\>; `checkTransactionsTracker`: (`actionTxKey`, `walletType`) => `object`; \}

Defined in: [packages/pulsar-evm/src/adapters/evmAdapter.ts:10](https://github.com/TuwaIO/pulsar-core/blob/cfb78f395afc8df6db7931c5480fbfd64ecfc7dc/packages/pulsar-evm/src/adapters/evmAdapter.ts#L10)

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
