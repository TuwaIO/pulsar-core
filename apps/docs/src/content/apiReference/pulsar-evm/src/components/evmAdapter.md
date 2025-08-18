[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# evmAdapter()

> **evmAdapter**\<`T`\>(`config`, `appChains`): `undefined` \| \{ `checkAndInitializeTrackerInStore`: (`__namedParameters`) => `Promise`\<`void`\>; `checkChainForTx`: (`chainId`) => `Promise`\<`void`\>; `checkTransactionsTracker`: (`actionTxKey`, `walletType`) => `object`; \}

Defined in: [packages/pulsar-evm/src/adapters/evmAdapter.ts:10](https://github.com/TuwaIO/pulsar-core/blob/44f872c8f9b5fcd7d79be45723669fe08a279bbb/packages/pulsar-evm/src/adapters/evmAdapter.ts#L10)

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
