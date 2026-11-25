# NonceAlreadyUsedError

Defined in: [utils/nonceAlreadyUsedError.ts:12](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/nonceAlreadyUsedError.ts#L12)

The error of `speedUpTxAction` and `cancelTxAction`, as the `cause` of what they throw, when the nonce of the transaction is already
used: the transaction was mined or replaced meanwhile, and no wallet prompt was opened. An app tells it by its `name`,
`NonceAlreadyUsedError`, and says so in its own words.

## Extends

- `Error`

## Constructors

### Constructor

> **new NonceAlreadyUsedError**(`hash`): `NonceAlreadyUsedError`

Defined in: [utils/nonceAlreadyUsedError.ts:18](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/nonceAlreadyUsedError.ts#L18)

#### Parameters

##### hash

`string`

The hash of the transaction, or the key it is tracked under.

#### Returns

`NonceAlreadyUsedError`

#### Overrides

`Error.constructor`

## Properties

### name

> **name**: `string` = `'NonceAlreadyUsedError'`

Defined in: [utils/nonceAlreadyUsedError.ts:13](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/nonceAlreadyUsedError.ts#L13)

#### Overrides

`Error.name`
