# Erc4337FetcherTx

> **Erc4337FetcherTx** = `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"txKey"` \| `"chainId"`\> & `Pick`\<[`EvmTransaction`](/packages/pulsar-core/type-aliases/EvmTransaction.md), `"pimlicoApiKey"` \| `"bundlerUrl"`\>

Defined in: [trackers/erc4337Tracker.ts:48](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/erc4337Tracker.ts#L48)

The transaction fields [erc4337Fetcher](/packages/pulsar-evm/functions/erc4337Fetcher.md) reads: the `userOpHash` as `txKey`, the numeric `chainId`, and either a
custom `bundlerUrl` or a `pimlicoApiKey` (without both, the public Pimlico endpoint is used).
