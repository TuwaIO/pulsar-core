# SolanaAdapterConfig

Defined in: [types.ts:10](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/types.ts#L10)

The configuration of [pulsarSolanaAdapter](/packages/pulsar-solana/functions/pulsarSolanaAdapter.md).

## Properties

### rpcUrls

> **rpcUrls**: `Partial`\<`Record`\<`SolanaClusterMoniker`, `string`\>\>

Defined in: [types.ts:15](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/types.ts#L15)

RPC URLs by cluster moniker (`mainnet`, `devnet`, `testnet`, `localnet`), used by `retryTxAction` when the
transaction has no `rpcUrl`. Clusters without a URL fall back to the public mainnet-beta endpoint.
