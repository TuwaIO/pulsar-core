[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmAdapter()

> **evmAdapter**\<`T`\>(`config`, `appChains`): `undefined` \| \{ `checkAndInitializeTrackerInStore`: (`__namedParameters`) => `Promise`\<`void`\>; `checkChainForTx`: (`chainId`) => `Promise`\<`void`\>; `checkTransactionsTracker`: (`actionTxKey`, `walletType`) => `object`; \}

Defined in: [packages/pulsar-evm/src/adapters/evmAdapter.ts:10](https://github.com/TuwaIO/pulsar-core/blob/1b4300a614d84f49e2f240cc8a629dd932f3f73b/packages/pulsar-evm/src/adapters/evmAdapter.ts#L10)

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
