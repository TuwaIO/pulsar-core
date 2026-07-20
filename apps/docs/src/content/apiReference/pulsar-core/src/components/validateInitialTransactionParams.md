[**API Reference.**](../../../README.md)

***

# validateInitialTransactionParams()

> **validateInitialTransactionParams**(`params`): `void`

Defined in: [packages/pulsar-core/src/utils/transactionValidation.ts:37](https://github.com/TuwaIO/pulsar-core/blob/7537cc09a326a69451e7718b6995858cbe2f63a0/packages/pulsar-core/src/utils/transactionValidation.ts#L37)

Validates metadata used before a transaction action is executed.
Throws when title, description, or payload violates Pulsar safety limits.

## Parameters

### params

`Omit`\<[`InitialTransactionParams`](../type-aliases/InitialTransactionParams.md), `"actionFunction"`\>

## Returns

`void`
