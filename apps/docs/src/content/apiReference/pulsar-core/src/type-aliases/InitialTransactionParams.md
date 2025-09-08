[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams

> **InitialTransactionParams** = `object`

Defined in: [packages/pulsar-core/src/types.ts:149](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L149)

Represents the parameters required to initiate a new transaction.

## Properties

### actionKey?

> `optional` **actionKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:153](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L153)

A key identifying the retry logic from the actions registry.

***

### adapter

> **adapter**: [`TransactionAdapter`](../enumerations/TransactionAdapter.md)

Defined in: [packages/pulsar-core/src/types.ts:151](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L151)

The transaction adapter type.

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:155](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L155)

A description for the transaction, with states for [pending, success, error, replaced].

***

### desiredChainID

> **desiredChainID**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:157](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L157)

The ID of the desired blockchain network.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:159](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L159)

Any additional data to be associated with the transaction.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:161](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L161)

A title for the transaction, with states for [pending, success, error, replaced].

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:163](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L163)

The type or category of the transaction (e.g., 'increment', 'approve').

***

### withTrackedModal?

> `optional` **withTrackedModal**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:165](https://github.com/TuwaIO/pulsar-core/blob/5e4fd0f371deb2427a774b38516e777830e67329/packages/pulsar-core/src/types.ts#L165)

If true, the detailed tracking modal will open automatically for this transaction.
