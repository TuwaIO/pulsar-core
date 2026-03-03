[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ActionTxKey

> **ActionTxKey** = `` `0x${string}` `` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:52](https://github.com/TuwaIO/pulsar-core/blob/d0c4882888327c2e3f6b0b4137e2a4cb2f61a986/packages/pulsar-core/src/types.ts#L52)

A union type representing the unique identifier returned by an `actionFunction`
after a transaction is submitted to the network or a relay service.

This key is crucial for the adapter to determine which tracker should
monitor the transaction.

It can be one of the following:
- A standard `0x...` transaction hash (`Hex`).
- A Solana transaction signature (string).
