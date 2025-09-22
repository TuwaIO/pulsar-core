[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# createSolanaRPC()

> **createSolanaRPC**(`rpcUrlOrMoniker`): `Rpc`\<`SolanaRpcApi`\>

Defined in: [packages/pulsar-solana/src/utils/createSolanaRPC.ts:44](https://github.com/TuwaIO/pulsar-core/blob/581af0fd8f6d32e377a9308802bc37dd710e7877/packages/pulsar-solana/src/utils/createSolanaRPC.ts#L44)

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
