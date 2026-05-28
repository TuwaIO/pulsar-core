[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# validateInitialTransactionParams()

> **validateInitialTransactionParams**(`params`): `void`

Defined in: [packages/pulsar-core/src/utils/transactionValidation.ts:37](https://github.com/TuwaIO/pulsar-core/blob/2826e1017439e66e75334b50f8700599de358e24/packages/pulsar-core/src/utils/transactionValidation.ts#L37)

Validates metadata used before a transaction action is executed.
Throws when title, description, or payload violates Pulsar safety limits.

## Parameters

### params

`Omit`\<[`InitialTransactionParams`](../type-aliases/InitialTransactionParams.md), `"actionFunction"`\>

## Returns

`void`
