[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:271](https://github.com/TuwaIO/pulsar-core/blob/bf965952c66068de202a09f972957e7674b640f1/packages/pulsar-core/src/types.ts#L271)

Represents a tracker for a specific transaction tied to an action and a connector.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:272](https://github.com/TuwaIO/pulsar-core/blob/bf965952c66068de202a09f972957e7674b640f1/packages/pulsar-core/src/types.ts#L272)

The key identifying the specific action related to the transaction.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:273](https://github.com/TuwaIO/pulsar-core/blob/bf965952c66068de202a09f972957e7674b640f1/packages/pulsar-core/src/types.ts#L273)

The type of connector used for the transaction (e.g., wallet provider, blockchain interface).

***

### gelatoApiKey?

> `optional` **gelatoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:275](https://github.com/TuwaIO/pulsar-core/blob/bf965952c66068de202a09f972957e7674b640f1/packages/pulsar-core/src/types.ts#L275)

An optional Gelato API key for Gelato relayer integration.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:274](https://github.com/TuwaIO/pulsar-core/blob/bf965952c66068de202a09f972957e7674b640f1/packages/pulsar-core/src/types.ts#L274)

An optional tracker object that monitors the status and progress of the transaction.
