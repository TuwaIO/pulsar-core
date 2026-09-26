# validateTransaction()

> **validateTransaction**\<`T`\>(`tx`): `void`

Defined in: [utils/transactionValidation.ts:77](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/transactionValidation.ts#L77)

Validates the title, description and payload of a complete transaction with the rules of
[validateInitialTransactionParams](/packages/pulsar-core/functions/validateInitialTransactionParams.md). Used by `addTxToPool`, `initializeTransactionsPool` and
`injectExternalPendingTxs`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### tx

`T`

The transaction.

## Returns

`void`

## Throws

[PulsarTransactionValidationError](/packages/pulsar-core/classes/PulsarTransactionValidationError.md) for the first field that breaks a rule.
