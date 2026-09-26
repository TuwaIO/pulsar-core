# validateInitialTransactionParams()

> **validateInitialTransactionParams**(`params`): `void`

Defined in: [utils/transactionValidation.ts:54](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/transactionValidation.ts#L54)

Validates the metadata passed to `executeTxAction` before anything else runs.

Each `title` string must be at most [MAX\_TRANSACTION\_TITLE\_LENGTH](/packages/pulsar-core/variables/MAX_TRANSACTION_TITLE_LENGTH.md) characters and each `description` string at
most [MAX\_TRANSACTION\_DESCRIPTION\_LENGTH](/packages/pulsar-core/variables/MAX_TRANSACTION_DESCRIPTION_LENGTH.md). `payload` must be JSON-serializable and at most
[MAX\_TRANSACTION\_PAYLOAD\_BYTES](/packages/pulsar-core/variables/MAX_TRANSACTION_PAYLOAD_BYTES.md) bytes as UTF-8 JSON. Strings (including payload keys) must not match
executable-like patterns: `eval(`, `Function(`, `setTimeout`/`setInterval` with a string argument, and `javascript:`.
This is a defensive gate, not a replacement for escaping output in the UI.

## Parameters

### params

`Omit`\<[`InitialTransactionParams`](/packages/pulsar-core/type-aliases/InitialTransactionParams.md), `"actionFunction"`\>

The transaction metadata.

## Returns

`void`

## Throws

[PulsarTransactionValidationError](/packages/pulsar-core/classes/PulsarTransactionValidationError.md) for the first field that breaks a rule.
