[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkChainForTx()

> **checkChainForTx**(`chainId`, `config`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/utils/checkChainForTx.ts:20](https://github.com/TuwaIO/pulsar-core/blob/eacf1eb9ef4f00f2ac864ab92c14d4197d5c3ae1/packages/pulsar-evm/src/utils/checkChainForTx.ts#L20)

Checks if the user's wallet is connected to the specified chain. If not, it prompts
the user to switch to the correct chain.

This function is a crucial prerequisite for any action that requires a specific network.

## Parameters

### chainId

`number`

The ID of the desired blockchain network.

### config

`Config`

The wagmi configuration object.

## Returns

`Promise`\<`void`\>

A promise that resolves when the wallet is on the correct chain.
It rejects if the user cancels the switch or if another error occurs.

## Throws

Throws a specific error if the user rejects the chain switch or if the switch fails for other reasons.
