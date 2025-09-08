[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# isEnsName()

> **isEnsName**(`address`): `boolean`

Defined in: [packages/pulsar-evm/src/utils/ensUtils.ts:77](https://github.com/TuwaIO/pulsar-core/blob/b0ff7a8ffae27fcad936b0644e260f6670a27857/packages/pulsar-evm/src/utils/ensUtils.ts#L77)

A simple heuristic to check if a string could be an ENS name.
It works by checking if the string is NOT a valid Ethereum address.

## Parameters

### address

`string`

The string to check.

## Returns

`boolean`

True if the string is not in a valid address format.
