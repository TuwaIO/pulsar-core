[**API Reference.**](../../../README.md)

***

# validateTransaction()

> **validateTransaction**\<`T`\>(`tx`): `void`

Defined in: [packages/pulsar-core/src/utils/transactionValidation.ts:55](https://github.com/TuwaIO/pulsar-core/blob/d8faba2b05042ba673e3ec758d4763f15973e717/packages/pulsar-core/src/utils/transactionValidation.ts#L55)

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
