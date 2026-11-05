# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:446](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L446)

The input of `TxAdapter.checkTransactionsTracker`: the key returned by the action and the context needed to pick a
tracker.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](/packages/pulsar-core/type-aliases/ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:448](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L448)

The key returned by `actionFunction`.

***

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:456](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L456)

Custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:450](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L450)

The connector that signed the transaction, for example `evm:safe` for a Safe wallet.

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:454](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L454)

#### Deprecated

Gelato relay is deprecated. Use `bundlerUrl` / `pimlicoApiKey` with ERC-4337 instead.

***

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:458](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L458)

Pimlico API key for ERC-4337 UserOperation tracking.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](/packages/pulsar-core/enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:452](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L452)

The tracker requested in `executeTxAction` params, if any.
