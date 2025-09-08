[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# ActionTxKey

> **ActionTxKey** = `Hex` \| [`GelatoTxKey`](GelatoTxKey.md)

Defined in: [packages/pulsar-evm/src/types.ts:28](https://github.com/TuwaIO/pulsar-core/blob/5e6e1f83790e94bf45cb45e22ff57cc8acc0effd/packages/pulsar-evm/src/types.ts#L28)

Represents the unique identifier returned by an action function after a transaction is submitted.
This key is used to determine which tracker should monitor the transaction.
It can be a standard transaction hash or a structured key from a relay service like Gelato.
