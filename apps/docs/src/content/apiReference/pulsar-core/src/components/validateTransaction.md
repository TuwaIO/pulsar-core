[**API Reference.**](../../../README.md)

***

# validateTransaction()

> **validateTransaction**\<`T`\>(`tx`): `void`

Defined in: [packages/pulsar-core/src/utils/transactionValidation.ts:55](https://github.com/TuwaIO/pulsar-core/blob/17a55cf59aedebd775206822ceabe49db52c0f88/packages/pulsar-core/src/utils/transactionValidation.ts#L55)

Validates a complete transaction before it is persisted or synchronized.
Throws when title, description, or payload violates Pulsar safety limits.

## Type Parameters

### T

`T` *extends* [`Transaction`](../type-aliases/Transaction.md)

## Parameters

### tx

`T`

## Returns

`void`
