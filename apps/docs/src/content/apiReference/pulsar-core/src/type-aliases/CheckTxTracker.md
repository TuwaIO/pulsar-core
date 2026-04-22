[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:259](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L259)

Represents a tracker for a specific transaction tied to an action and a connector.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:260](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L260)

The key identifying the specific action related to the transaction.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:261](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L261)

The type of connector used for the transaction (e.g., wallet provider, blockchain interface).

***

### gelatoApiKey?

> `optional` **gelatoApiKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:263](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L263)

An optional Gelato API key for Gelato relayer integration.

***

### tracker?

> `optional` **tracker**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:262](https://github.com/TuwaIO/pulsar-core/blob/e4ac858d48fffccbb983da2317a9e4133a8cabfb/packages/pulsar-core/src/types.ts#L262)

An optional tracker object that monitors the status and progress of the transaction.
