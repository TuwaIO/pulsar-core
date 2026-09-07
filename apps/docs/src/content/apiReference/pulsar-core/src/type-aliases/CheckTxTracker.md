[**API Reference.**](../../../README.md)

***

# ~~CheckTxTracker~~

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:287](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L287)

Represents a tracker for a specific transaction tied to an action and a connector.

## Deprecated

Gelato API key for Gelato relayer integration.

## Properties

### ~~actionTxKey~~

> **actionTxKey**: [`ActionTxKey`](ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:288](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L288)

The key identifying the specific action related to the transaction.

***

### ~~bundlerUrl?~~

> `optional` **bundlerUrl?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:294](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L294)

Optional custom bundler RPC URL for ERC-4337 UserOperation tracking.

***

### ~~connectorType~~

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:289](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L289)

The type of connector used for the transaction (e.g., wallet provider, blockchain interface).

***

### ~~gelatoApiKey?~~

> `optional` **gelatoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:292](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L292)

***

### ~~pimlicoApiKey?~~

> `optional` **pimlicoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:296](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L296)

Optional Pimlico API key for ERC-4337 UserOperation tracking.

***

### ~~tracker?~~

> `optional` **tracker?**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:290](https://github.com/TuwaIO/pulsar-core/blob/ea1149b0cc6a30a2063b7734187b89d4981eb82e/packages/pulsar-core/src/types.ts#L290)

An optional tracker object that monitors the status and progress of the transaction.
