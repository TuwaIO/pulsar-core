[**API Reference.**](../../../README.md)

***

# validateInitialTransactionParams()

> **validateInitialTransactionParams**(`params`): `void`

Defined in: [packages/pulsar-core/src/utils/transactionValidation.ts:37](https://github.com/TuwaIO/pulsar-core/blob/c009e922cecf941d1fcdf2f75b06344c7f83e79e/packages/pulsar-core/src/utils/transactionValidation.ts#L37)

Validates metadata used before a transaction action is executed.
Throws when title, description, or payload violates Pulsar safety limits.

## Parameters

### params

`Omit`\<[`InitialTransactionParams`](../type-aliases/InitialTransactionParams.md), `"actionFunction"`\>

## Returns

`void`
