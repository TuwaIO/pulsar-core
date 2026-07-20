[**API Reference.**](../../../README.md)

***

# UpdatableTransactionFields

> **UpdatableTransactionFields** = `Partial`\<`Pick`\<[`EvmTransaction`](EvmTransaction.md), `"to"` \| `"nonce"` \| `"txKey"` \| `"pending"` \| `"hash"` \| `"status"` \| `"replacedTxHash"` \| `"error"` \| `"finishedTimestamp"` \| `"isTrackedModalOpen"` \| `"isError"` \| `"maxPriorityFeePerGas"` \| `"maxFeePerGas"` \| `"input"` \| `"value"` \| `"confirmations"` \| `"requiredConfirmations"`\>\> & `Partial`\<`Pick`\<[`SolanaTransaction`](SolanaTransaction.md), `"slot"` \| `"confirmations"` \| `"fee"` \| `"instructions"` \| `"recentBlockhash"` \| `"rpcUrl"`\>\>

Defined in: [packages/pulsar-core/src/types.ts:365](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/types.ts#L365)

A utility type that creates a union of all fields that can be safely updated
on a transaction object via the `updateTxParams` action. This ensures type safety
and prevents accidental modification of immutable properties.
