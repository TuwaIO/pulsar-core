# PulsarTransactionValidationError

Defined in: [utils/transactionValidation.ts:27](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/transactionValidation.ts#L27)

Thrown when the title, description or payload of a transaction breaks Pulsar's safety limits.

## Extends

- `Error`

## Constructors

### Constructor

> **new PulsarTransactionValidationError**(`field`, `message`): `PulsarTransactionValidationError`

Defined in: [utils/transactionValidation.ts:35](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/transactionValidation.ts#L35)

#### Parameters

##### field

`string`

The field that failed.

##### message

`string`

The error message.

#### Returns

`PulsarTransactionValidationError`

#### Overrides

`Error.constructor`

## Properties

### field

> `readonly` **field**: `string`

Defined in: [utils/transactionValidation.ts:29](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/transactionValidation.ts#L29)

The field that failed, for example `title`, `description[1]` or `payload.amount`.
