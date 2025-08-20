[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# isEnsName()

> **isEnsName**(`address`): `boolean`

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:77](https://github.com/TuwaIO/pulsar-core/blob/cef3f4fa8c4f60c96b5803206f685db0060e639e/packages/pulsar-evm/src/utils/ensUtils.ts#L77)

A simple heuristic to check if a string could be an ENS name.
It works by checking if the string is NOT a valid Ethereum address.

## Parameters

### address

`string`

The string to check.

## Returns

`boolean`

True if the string is not in a valid address format.
