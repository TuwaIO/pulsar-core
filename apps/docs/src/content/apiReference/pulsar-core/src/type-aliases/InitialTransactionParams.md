[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# InitialTransactionParams

> **InitialTransactionParams** = `object`

Defined in: [packages/pulsar-core/src/types.ts:173](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L173)

Represents the parameters required to initiate a new transaction tracking flow.

## Properties

### actionKey?

> `optional` **actionKey**: `string`

Defined in: [packages/pulsar-core/src/types.ts:176](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L176)

A key to identify the re-executable action from the `TxActions` registry.

***

### adapter

> **adapter**: [`TransactionAdapter`](../enumerations/TransactionAdapter.md)

Defined in: [packages/pulsar-core/src/types.ts:174](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L174)

***

### description?

> `optional` **description**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:178](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L178)

A user-facing description for the transaction.

***

### desiredChainID

> **desiredChainID**: `number` \| `string`

Defined in: [packages/pulsar-core/src/types.ts:180](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L180)

The target chain ID for the transaction.

***

### payload?

> `optional` **payload**: `object`

Defined in: [packages/pulsar-core/src/types.ts:182](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L182)

Any custom data to associate with the transaction.

***

### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: [packages/pulsar-core/src/types.ts:190](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L190)

Required for Solana transactions. The RPC URL to use for the transaction.

***

### title?

> `optional` **title**: `string` \| \[`string`, `string`, `string`, `string`\]

Defined in: [packages/pulsar-core/src/types.ts:184](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L184)

A user-facing title for the transaction.

***

### type

> **type**: `string`

Defined in: [packages/pulsar-core/src/types.ts:186](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L186)

The application-specific type of the transaction.

***

### withTrackedModal?

> `optional` **withTrackedModal**: `boolean`

Defined in: [packages/pulsar-core/src/types.ts:188](https://github.com/TuwaIO/pulsar-core/blob/985edec1767ef15f98a2291cd2f4c155d4746f3b/packages/pulsar-core/src/types.ts#L188)

If true, the detailed tracking modal will open automatically upon initiation.
