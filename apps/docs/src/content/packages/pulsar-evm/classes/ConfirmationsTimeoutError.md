# ConfirmationsTimeoutError

Defined in: [trackers/evmTracker.ts:74](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L74)

The error of `onFailure` when a mined transaction did not reach its confirmations within `confirmationsTimeout`. The
transaction is mined: `receipt` says how.

## Extends

- `Error`

## Constructors

### Constructor

> **new ConfirmationsTimeoutError**(`receipt`, `needed`): `ConfirmationsTimeoutError`

Defined in: [trackers/evmTracker.ts:83](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L83)

#### Parameters

##### receipt

`TransactionReceipt`

The receipt of the transaction.

##### needed

`number`

The confirmations it did not reach.

#### Returns

`ConfirmationsTimeoutError`

#### Overrides

`Error.constructor`

## Properties

### name

> **name**: `string` = `'ConfirmationsTimeoutError'`

Defined in: [trackers/evmTracker.ts:75](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L75)

#### Overrides

`Error.name`

***

### receipt

> `readonly` **receipt**: `TransactionReceipt`

Defined in: [trackers/evmTracker.ts:77](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L77)

The receipt of the transaction.
