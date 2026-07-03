[**API Reference.**](../../../README.md)

***

# validateInitialTransactionParams()

> **validateInitialTransactionParams**(`params`): `void`

Defined in: [packages/pulsar-core/src/utils/transactionValidation.ts:37](https://github.com/TuwaIO/pulsar-core/blob/b07dd22051bc55774d8350cd6e66a57ea987b080/packages/pulsar-core/src/utils/transactionValidation.ts#L37)

Validates metadata used before a transaction action is executed.
Throws when title, description, or payload violates Pulsar safety limits.

## Parameters

### params

`Omit`\<[`InitialTransactionParams`](../type-aliases/InitialTransactionParams.md), `"actionFunction"`\>

## Returns

`void`
