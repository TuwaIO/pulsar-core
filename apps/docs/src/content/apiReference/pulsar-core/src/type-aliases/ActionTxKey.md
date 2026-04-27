[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ActionTxKey

> **ActionTxKey** = `` `0x${string}` `` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:52](https://github.com/TuwaIO/pulsar-core/blob/e793f6c1aec3029357d46a261bbd91915587721b/packages/pulsar-core/src/types.ts#L52)

A union type representing the unique identifier returned by an `actionFunction`
after a transaction is submitted to the network or a relay service.

This key is crucial for the adapter to determine which tracker should
monitor the transaction.

It can be one of the following:
- A standard `0x...` transaction hash (`Hex`).
- A Solana transaction signature (string).
