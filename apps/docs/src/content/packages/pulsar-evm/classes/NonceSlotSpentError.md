# NonceSlotSpentError

Defined in: [utils/readNonceSlot.ts:91](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L91)

The error of a tracker when the nonce of its transaction is spent and no transaction could be found for it. The
tracked transaction can never land, but money may have moved in the transaction that spent the nonce.

## Extends

- `Error`

## Constructors

### Constructor

> **new NonceSlotSpentError**(`hash`): `NonceSlotSpentError`

Defined in: [utils/readNonceSlot.ts:97](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L97)

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

Defined in: [utils/readNonceSlot.ts:92](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L92)

#### Overrides

`Error.name`
