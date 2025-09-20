[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createSolanaRPC()

> **createSolanaRPC**(`rpcUrlOrMoniker`): `Rpc`\<`SolanaRpcApi`\>

Defined in: [packages/pulsar-solana/src/utils/createSolanaRPC.ts:44](https://github.com/TuwaIO/pulsar-core/blob/31123a566c475bf283a6fb73d21ae43fa38204d1/packages/pulsar-solana/src/utils/createSolanaRPC.ts#L44)

**`Internal`**

Retrieves a cached RPC client for a given URL or cluster moniker.
If no cached client exists, it creates a new instance.

## Parameters

### rpcUrlOrMoniker

`string`

Either a full RPC URL or a cluster moniker like 'mainnet'.

## Returns

`Rpc`\<`SolanaRpcApi`\>

The RPC client instance.
