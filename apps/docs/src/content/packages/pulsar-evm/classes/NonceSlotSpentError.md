# NonceSlotSpentError

Defined in: [utils/readNonceSlot.ts:93](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L93)

The error of a tracker when the nonce of its transaction is spent and no transaction could be found for it. The
tracked transaction can never land, but money may have moved in the transaction that spent the nonce.

## Extends

- `Error`

## Constructors

### Constructor

> **new NonceSlotSpentError**(`hash`): `NonceSlotSpentError`

Defined in: [utils/readNonceSlot.ts:99](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L99)

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

Defined in: [utils/readNonceSlot.ts:94](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L94)

#### Overrides

`Error.name`
