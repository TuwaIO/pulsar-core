# SolanaFetcherTx

> **SolanaFetcherTx** = `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"adapter"` \| `"txKey"` \| `"chainId"` \| `"localTimestamp"` \| `"rpcUrl"`\> & `Pick`\<[`SolanaTransaction`](/packages/pulsar-core/type-aliases/SolanaTransaction.md), `"fee"` \| `"recentBlockhash"` \| `"instructions"` \| `"lastValidBlockHeight"`\>

Defined in: [trackers/solanaTracker.ts:53](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L53)

The transaction fields [solanaFetcher](/packages/pulsar-solana/functions/solanaFetcher.md) reads: `adapter` (must be `OrbitAdapter.SOLANA`), the signature as
`txKey`, `rpcUrl` or the cluster in `chainId`, `localTimestamp`, and the details it already knows, if any.
