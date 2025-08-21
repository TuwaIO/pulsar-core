[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getActiveWalletAndClient()

> **getActiveWalletAndClient**(`config`): `object`

Defined in: [packages/pulsar-evm/src/utils/getActiveWalletAndClient.ts:16](https://github.com/TuwaIO/pulsar-core/blob/9890df666896bc90d295d9e4ac3c49adc5759a90/packages/pulsar-evm/src/utils/getActiveWalletAndClient.ts#L16)

Retrieves the active wallet account and the viem Wallet Client from the wagmi config.
It ensures that a wallet is connected by throwing an error if it's not.

## Parameters

### config

`Config`

The wagmi configuration object.

## Returns

`object`

An object containing the connected account details and the viem Wallet Client.

### activeWallet

> **activeWallet**: `GetAccountReturnType`

### walletClient

> **walletClient**: `GetClientReturnType`

## Throws

Throws an error with the message "Wallet not connected" if no wallet is connected or the client is unavailable.
