# UpdatableTransactionFields

> **UpdatableTransactionFields** = `Partial`\<`Pick`\<[`EvmTransaction`](/packages/pulsar-core/type-aliases/EvmTransaction.md), `"to"` \| `"nonce"` \| `"txKey"` \| `"pending"` \| `"hash"` \| `"status"` \| `"replacedTxHash"` \| `"replacedReason"` \| `"sender"` \| `"error"` \| `"finishedTimestamp"` \| `"isTrackedModalOpen"` \| `"isError"` \| `"maxPriorityFeePerGas"` \| `"maxFeePerGas"` \| `"input"` \| `"value"` \| `"confirmations"` \| `"requiredConfirmations"`\>\> & `Partial`\<`Pick`\<[`SolanaTransaction`](/packages/pulsar-core/type-aliases/SolanaTransaction.md), `"slot"` \| `"confirmations"` \| `"fee"` \| `"instructions"` \| `"recentBlockhash"` \| `"rpcUrl"` \| `"confirmationStatus"` \| `"lastValidBlockHeight"`\>\>

Defined in: [packages/pulsar-core/src/types.ts:549](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L549)

The fields `updateTxParams` accepts: the fields trackers change while a transaction is tracked.
