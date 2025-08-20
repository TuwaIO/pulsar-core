[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkChainForTx()

> **checkChainForTx**(`chainId`, `config`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/utils/checkChainForTx.ts:18](https://github.com/TuwaIO/pulsar-core/blob/059fb1fb20bad7ab55e675cc3194e0d9a366071c/packages/pulsar-evm/src/utils/checkChainForTx.ts#L18)

Checks if the user's wallet is connected to the specified chain. If not, it prompts
the user to switch to the correct chain and waits for the operation to complete.

## Parameters

### chainId

`number`

The ID of the desired blockchain network.

### config

`Config`

The wagmi configuration object.

## Returns

`Promise`\<`void`\>

A promise that resolves when the wallet is on the correct chain,
or rejects if the user cancels the switch or an error occurs.

## Throws

Throws an error if the user rejects the chain switch or if the switch fails.
