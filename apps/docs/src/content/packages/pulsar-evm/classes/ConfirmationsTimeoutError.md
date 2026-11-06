# ConfirmationsTimeoutError

Defined in: [trackers/evmTracker.ts:55](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L55)

The error of `onFailure` when a mined transaction did not reach its confirmations within `confirmationsTimeout`. The
transaction is mined: `receipt` says how.

## Extends

- `Error`

## Constructors

### Constructor

> **new ConfirmationsTimeoutError**(`receipt`, `needed`): `ConfirmationsTimeoutError`

Defined in: [trackers/evmTracker.ts:64](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L64)

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

Defined in: [trackers/evmTracker.ts:56](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L56)

#### Overrides

`Error.name`

***

### receipt

> `readonly` **receipt**: `TransactionReceipt`

Defined in: [trackers/evmTracker.ts:58](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L58)

The receipt of the transaction.
