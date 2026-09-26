# ActionTxKey

> **ActionTxKey** = `` `0x${string}` `` \| `string`

Defined in: [types.ts:57](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L57)

The identifier returned by an `actionFunction` once the transaction is submitted: an EVM transaction hash, an
ERC-4337 `userOpHash`, a Safe `safeTxHash`, a Gelato task ID or a Solana signature. The adapter uses it to pick the
tracker and the `txKey` of the transaction.
