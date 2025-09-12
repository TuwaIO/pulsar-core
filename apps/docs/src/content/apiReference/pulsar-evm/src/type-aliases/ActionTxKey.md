[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ActionTxKey

> **ActionTxKey** = `Hex` \| [`GelatoTxKey`](GelatoTxKey.md)

Defined in: [packages/pulsar-evm/src/types.ts:35](https://github.com/TuwaIO/pulsar-core/blob/494f4105ae0c6206b7fb474bf50e2b00399fd8c0/packages/pulsar-evm/src/types.ts#L35)

A union type representing the unique identifier returned by an `actionFunction`
after a transaction is submitted to the network or a relay service.

This key is crucial for the EVM adapter to determine which tracker should
monitor the transaction.

It can be one of the following:
- A standard `0x...` transaction hash (`Hex`).
- A structured object from a relay service like Gelato (`GelatoTxKey`).
