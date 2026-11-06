# NonceSlotSpentError

Defined in: [utils/readNonceSlot.ts:82](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L82)

The error of a tracker when the nonce of its transaction is spent and no transaction could be found for it. The
tracked transaction can never land, but money may have moved in the transaction that spent the nonce.

## Extends

- `Error`

## Constructors

### Constructor

> **new NonceSlotSpentError**(`hash`): `NonceSlotSpentError`

Defined in: [utils/readNonceSlot.ts:88](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L88)

#### Parameters

##### hash

`` `0x${string}` ``

The hash of the transaction that can no longer land.

#### Returns

`NonceSlotSpentError`

#### Overrides

`Error.constructor`

## Properties

### name

> **name**: `string` = `'NonceSlotSpentError'`

Defined in: [utils/readNonceSlot.ts:83](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L83)

#### Overrides

`Error.name`
