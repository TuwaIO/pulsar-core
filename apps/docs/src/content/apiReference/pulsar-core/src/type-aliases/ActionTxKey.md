[**API Reference.**](../../../README.md)

***

# ActionTxKey

> **ActionTxKey** = `` `0x${string}` `` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:52](https://github.com/TuwaIO/pulsar-core/blob/6a829cc584a4473ad994020ccbe6fa99848e8820/packages/pulsar-core/src/types.ts#L52)

A union type representing the unique identifier returned by an `actionFunction`
after a transaction is submitted to the network or a relay service.

This key is crucial for the adapter to determine which tracker should
monitor the transaction.

It can be one of the following:
- A standard `0x...` transaction hash (`Hex`).
- A Solana transaction signature (string).
