[**API Reference.**](../../../README.md)

***

# ~~CheckTxTracker~~

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:290](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L290)

Represents a tracker for a specific transaction tied to an action and a connector.

## Deprecated

Gelato API key for Gelato relayer integration.

## Properties

### ~~actionTxKey~~

> **actionTxKey**: [`ActionTxKey`](ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:291](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L291)

The key identifying the specific action related to the transaction.

***

### ~~bundlerUrl?~~

> `optional` **bundlerUrl?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:297](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L297)

Optional custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### ~~connectorType~~

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:292](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L292)

The type of connector used for the transaction (e.g., wallet provider, blockchain interface).

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:295](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L295)

***

### ~~pimlicoApiKey?~~

> `optional` **pimlicoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:299](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L299)

Optional Pimlico API key for ERC-4337 UserOperation tracking.

***

### ~~tracker?~~

> `optional` **tracker?**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:293](https://github.com/TuwaIO/pulsar-core/blob/e0149314d187da7baa08d06ba8554c6c4a303013/packages/pulsar-core/src/types.ts#L293)

An optional tracker object that monitors the status and progress of the transaction.
