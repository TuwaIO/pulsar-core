# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:432](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L432)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:434](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L434)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:440](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L440)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:436](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L436)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:442](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L442)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:438](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L438)

The tracker requested in `executeTxAction` params, if any.
