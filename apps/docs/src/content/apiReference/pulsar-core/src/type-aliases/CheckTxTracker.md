[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# CheckTxTracker

> **CheckTxTracker** = `object`

Defined in: [packages/pulsar-core/src/types.ts:254](https://github.com/TuwaIO/pulsar-core/blob/8be19767362bf473366bbca846b06a4e9e0f99de/packages/pulsar-core/src/types.ts#L254)

Represents a tracker for a specific transaction tied to an action and a connector.

## Properties

### actionTxKey

> **actionTxKey**: [`ActionTxKey`](ActionTxKey.md)

Defined in: [packages/pulsar-core/src/types.ts:255](https://github.com/TuwaIO/pulsar-core/blob/8be19767362bf473366bbca846b06a4e9e0f99de/packages/pulsar-core/src/types.ts#L255)

The key identifying the specific action related to the transaction.

***

### connectorType

> **connectorType**: `string`

Defined in: [packages/pulsar-core/src/types.ts:256](https://github.com/TuwaIO/pulsar-core/blob/8be19767362bf473366bbca846b06a4e9e0f99de/packages/pulsar-core/src/types.ts#L256)

The type of connector used for the transaction (e.g., wallet provider, blockchain interface).

***

### gelatoApiKey?

> `optional` **gelatoApiKey?**: `string`

Defined in: [packages/pulsar-core/src/types.ts:258](https://github.com/TuwaIO/pulsar-core/blob/8be19767362bf473366bbca846b06a4e9e0f99de/packages/pulsar-core/src/types.ts#L258)

An optional Gelato API key for Gelato relayer integration.

***

### tracker?

> `optional` **tracker?**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

Defined in: [packages/pulsar-core/src/types.ts:257](https://github.com/TuwaIO/pulsar-core/blob/8be19767362bf473366bbca846b06a4e9e0f99de/packages/pulsar-core/src/types.ts#L257)

An optional tracker object that monitors the status and progress of the transaction.
