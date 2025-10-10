[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ActionTxKey

> **ActionTxKey** = `` `0x${string}` `` \| [`GelatoTxKey`](GelatoTxKey.md) \| `string`

Defined in: [packages/pulsar-core/src/types.ts:50](https://github.com/TuwaIO/pulsar-core/blob/218599a38fbb7ca6ddbf6d3718f1f87883cde391/packages/pulsar-core/src/types.ts#L50)

A union type representing the unique identifier returned by an `actionFunction`
after a transaction is submitted to the network or a relay service.

This key is crucial for the adapter to determine which tracker should
monitor the transaction.

It can be one of the following:
- A standard `0x...` transaction hash (`Hex`).
- A structured object from a relay service like Gelato (`GelatoTxKey`).
- A Solana transaction signature (string).
