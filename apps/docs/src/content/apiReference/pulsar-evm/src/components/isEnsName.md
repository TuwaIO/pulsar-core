[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# isEnsName()

> **isEnsName**(`address`): `boolean`

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:79](https://github.com/TuwaIO/pulsar-core/blob/dbbc3a2abf86991b161bee65372e50210926b49f/packages/pulsar-evm/src/utils/ensUtils.ts#L79)

A simple heuristic to check if a string could be an ENS name.
It works by checking if the string is NOT a valid Ethereum address.

## Parameters

### address

`string`

The string to check.

## Returns

`boolean`

True if the string is not in a valid address format.
