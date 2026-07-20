[**API Reference.**](../../../README.md)

***

# validateTransaction()

> **validateTransaction**\<`T`\>(`tx`): `void`

Defined in: [packages/pulsar-core/src/utils/transactionValidation.ts:55](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/utils/transactionValidation.ts#L55)

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
