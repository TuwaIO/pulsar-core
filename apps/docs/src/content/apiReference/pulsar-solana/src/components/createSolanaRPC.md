[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createSolanaRPC()

> **createSolanaRPC**(`rpcUrlOrMoniker`): `Rpc`\<`SolanaRpcApi`\>

Defined in: [packages/pulsar-solana/src/utils/createSolanaRPC.ts:44](https://github.com/TuwaIO/pulsar-core/blob/2549443ce7aac31e7aaa13b9eb5f687e5d4297b4/packages/pulsar-solana/src/utils/createSolanaRPC.ts#L44)

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
