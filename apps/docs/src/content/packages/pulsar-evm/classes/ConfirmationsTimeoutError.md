# ConfirmationsTimeoutError

Defined in: [trackers/evmTracker.ts:60](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L60)

The error of `onFailure` when a mined transaction did not reach its confirmations within `confirmationsTimeout`. The
transaction is mined: `receipt` says how.

## Extends

- `Error`

## Constructors

### Constructor

> **new ConfirmationsTimeoutError**(`receipt`, `needed`): `ConfirmationsTimeoutError`

Defined in: [trackers/evmTracker.ts:69](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L69)

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

Defined in: [trackers/evmTracker.ts:61](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L61)

#### Overrides

`Error.name`

***

### receipt

> `readonly` **receipt**: `TransactionReceipt`

Defined in: [trackers/evmTracker.ts:63](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L63)

The receipt of the transaction.
