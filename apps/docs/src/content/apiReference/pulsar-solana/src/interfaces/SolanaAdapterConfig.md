[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# SolanaAdapterConfig

Defined in: [packages/pulsar-solana/src/types.ts:21](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/types.ts#L21)

Configuration object for the `solanaAdapter`.
All properties are optional and are typically derived from the Solana wallet adapter hooks.

## Properties

### cluster?

> `optional` **cluster**: [`SolanaCluster`](../type-aliases/SolanaCluster.md)

Defined in: [packages/pulsar-solana/src/types.ts:25](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/types.ts#L25)

The specific cluster the app is connected to. Used for generating correct explorer links.

***

### connection?

> `optional` **connection**: `ConnectionContextState`

Defined in: [packages/pulsar-solana/src/types.ts:23](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/types.ts#L23)

The state object from `useConnection()`. Required for on-chain operations like checking the network or using the Solana Name Service.

***

### explorerUrl?

> `optional` **explorerUrl**: `string`

Defined in: [packages/pulsar-solana/src/types.ts:24](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/types.ts#L24)

The base URL for the transaction explorer (e.g., "https://solscan.io"). Defaults to Solscan if not provided.

***

### wallet?

> `optional` **wallet**: `WalletContextState`

Defined in: [packages/pulsar-solana/src/types.ts:22](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-solana/src/types.ts#L22)

The state object from `useWallet()`. Required for actions that need a connected wallet, like signing or retrying transactions.
