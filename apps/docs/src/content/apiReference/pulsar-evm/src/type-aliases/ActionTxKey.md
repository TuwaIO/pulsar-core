[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ActionTxKey

> **ActionTxKey** = `Hex` \| [`GelatoTxKey`](GelatoTxKey.md)

Defined in: [packages/pulsar-evm/src/types.ts:35](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-evm/src/types.ts#L35)

A union type representing the unique identifier returned by an `actionFunction`
after a transaction is submitted to the network or a relay service.

This key is crucial for the EVM adapter to determine which tracker should
monitor the transaction.

It can be one of the following:
- A standard `0x...` transaction hash (`Hex`).
- A structured object from a relay service like Gelato (`GelatoTxKey`).
