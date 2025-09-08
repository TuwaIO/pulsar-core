[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams

> **InitialTransactionParams** = `object`

Defined in: [packages/pulsar-core/src/types.ts:152](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L152)

Represents the parameters required to initiate a new transaction.

## Properties

### actionKey?

> `optional` **actionKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:156](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L156)

A key identifying the retry logic from the actions registry.

***

### adapter

> **adapter**: [`TransactionAdapter`](../enumerations/TransactionAdapter.md)

Defined in: [packages/pulsar-core/src/types.ts:154](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L154)

The transaction adapter type.

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:158](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L158)

A description for the transaction, with states for [pending, success, error, replaced].

***

### desiredChainID

> **desiredChainID**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:160](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L160)

The ID of the desired blockchain network.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:162](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L162)

Any additional data to be associated with the transaction.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:164](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L164)

A title for the transaction, with states for [pending, success, error, replaced].

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:166](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L166)

The type or category of the transaction (e.g., 'increment', 'approve').

***

### withTrackedModal?

> `optional` **withTrackedModal**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:168](https://github.com/TuwaIO/pulsar-core/blob/815bc21285ae9bacc614d9409dbf8732e5b5c450/packages/pulsar-core/src/types.ts#L168)

If true, the detailed tracking modal will open automatically for this transaction.
