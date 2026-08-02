[**API Reference.**](../../../README.md)

***

# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:276](https://github.com/TuwaIO/pulsar-core/blob/bb2c7f5adf67dff511491c128becfd729d029745/packages/pulsar-core/src/types.ts#L276)

Represents a tracker for a specific transaction tied to an action and a connector.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:277](https://github.com/TuwaIO/pulsar-core/blob/bb2c7f5adf67dff511491c128becfd729d029745/packages/pulsar-core/src/types.ts#L277)

The key identifying the specific action related to the transaction.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:278](https://github.com/TuwaIO/pulsar-core/blob/bb2c7f5adf67dff511491c128becfd729d029745/packages/pulsar-core/src/types.ts#L278)

The type of connector used for the transaction (e.g., wallet provider, blockchain interface).

***

### gelatoApiKey?

> `optional` **gelatoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:280](https://github.com/TuwaIO/pulsar-core/blob/bb2c7f5adf67dff511491c128becfd729d029745/packages/pulsar-core/src/types.ts#L280)

An optional Gelato API key for Gelato relayer integration.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:279](https://github.com/TuwaIO/pulsar-core/blob/bb2c7f5adf67dff511491c128becfd729d029745/packages/pulsar-core/src/types.ts#L279)

An optional tracker object that monitors the status and progress of the transaction.
