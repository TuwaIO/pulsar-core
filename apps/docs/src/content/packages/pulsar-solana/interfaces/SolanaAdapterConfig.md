# SolanaAdapterConfig

Defined in: [types.ts:10](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/types.ts#L10)

The configuration of [pulsarSolanaAdapter](/packages/pulsar-solana/functions/pulsarSolanaAdapter.md).

## Properties

### rpcUrls

> **rpcUrls**: `Partial`\<`Record`\<`SolanaClusterMoniker`, `SolanaRpcUrl`\>\>

Defined in: [types.ts:16](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/types.ts#L16)

RPC URLs by cluster moniker (`mainnet`, `devnet`, `testnet`, `localnet`), one or several a cluster, the one source
of the tracker's and `retryTxAction`'s endpoint. A read goes to the next URL of a cluster when one does not answer.
A cluster without a URL uses its public endpoint.
