[**API Reference.**](../../../README.md)

***

# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:274](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/types.ts#L274)

Represents a tracker for a specific transaction tied to an action and a connector.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:275](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/types.ts#L275)

The key identifying the specific action related to the transaction.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:276](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/types.ts#L276)

The type of connector used for the transaction (e.g., wallet provider, blockchain interface).

***

### gelatoApiKey?

> `optional` **gelatoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:278](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/types.ts#L278)

An optional Gelato API key for Gelato relayer integration.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:277](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/types.ts#L277)

An optional tracker object that monitors the status and progress of the transaction.
