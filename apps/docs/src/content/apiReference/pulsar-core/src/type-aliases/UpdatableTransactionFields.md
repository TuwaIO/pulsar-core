[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# UpdatableTransactionFields

> **UpdatableTransactionFields** = `Partial`\<`Pick`\<[`EvmTransaction`](EvmTransaction.md), `"to"` \| `"nonce"` \| `"txKey"` \| `"pending"` \| `"hash"` \| `"status"` \| `"replacedTxHash"` \| `"error"` \| `"finishedTimestamp"` \| `"isTrackedModalOpen"` \| `"isError"` \| `"maxPriorityFeePerGas"` \| `"maxFeePerGas"` \| `"input"` \| `"value"`\>\> & `Partial`\<`Pick`\<[`SolanaTransaction`](SolanaTransaction.md), `"slot"` \| `"confirmations"` \| `"fee"` \| `"instructions"` \| `"recentBlockhash"` \| `"rpcUrl"`\>\>

Defined in: [packages/pulsar-core/src/types.ts:350](https://github.com/TuwaIO/pulsar-core/blob/5f182e29003409398051d1d02ec9c947396d97e5/packages/pulsar-core/src/types.ts#L350)

A utility type that creates a union of all fields that can be safely updated
on a transaction object via the `updateTxParams` action. This ensures type safety
and prevents accidental modification of immutable properties.
