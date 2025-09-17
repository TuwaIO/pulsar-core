[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# getActiveWalletAndClient()

> **getActiveWalletAndClient**(`config`): `object`

Defined in: [packages/pulsar-evm/src/utils/getActiveWalletAndClient.ts:22](https://github.com/TuwaIO/pulsar-core/blob/6a657679559c2bafbe8c9280c593db265ce3faeb/packages/pulsar-evm/src/utils/getActiveWalletAndClient.ts#L22)

Retrieves the active wallet account and the viem Wallet Client from the wagmi config.
This function acts as a safeguard, ensuring that a wallet is connected before
attempting any on-chain actions.

## Parameters

### config

`Config`

The wagmi configuration object.

## Returns

`object`

An object containing the connected account details and the viem Wallet Client.
The return types are guaranteed to be non-nullable.

### activeWallet

> **activeWallet**: `GetAccountReturnType`

### walletClient

> **walletClient**: `object`

#### walletClient.account

> **account**: `undefined` \| `Account`

The Account of the Client.

#### walletClient.batch?

> `optional` **batch**: `object`

Flags for batch settings.

#### walletClient.batch.multicall?

> `optional` **multicall**: `boolean` \| \{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}

Toggle to enable `eth_call` multicall aggregation.

##### Type Declaration

`boolean`

\{ `batchSize?`: `number`; `deployless?`: `boolean`; `wait?`: `number`; \}

#### walletClient.cacheTime

> **cacheTime**: `number`

Time (in ms) that cached data will remain in memory.

#### walletClient.ccipRead?

> `optional` **ccipRead**: `false` \| \{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

[CCIP Read](https://eips.ethereum.org/EIPS/eip-3668) configuration.

##### Type Declaration

`false`

\{ `request?`: (`parameters`) => `Promise`\<`` `0x${string}` ``\>; \}

#### walletClient.chain

> **chain**: `Chain`

Chain for the client.

#### walletClient.experimental\_blockTag?

> `optional` **experimental\_blockTag**: `BlockTag`

Default block tag to use for RPC requests.

#### walletClient.extend()

> **extend**: \<`client`\>(`fn`) => `Client`\<`Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>, `Chain`, `undefined` \| `Account`, `undefined`, \{ \[K in string \| number \| symbol\]: client\[K\] \}\>

##### Type Parameters

###### client

`client` *extends* `object` & `ExactPartial`\<`ExtendableProtectedActions`\<`Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>, `Chain`, `undefined` \| `Account`\>\>

##### Parameters

###### fn

(`client`) => `client`

##### Returns

`Client`\<`Transport`\<`string`, `Record`\<`string`, `any`\>, `EIP1193RequestFn`\>, `Chain`, `undefined` \| `Account`, `undefined`, \{ \[K in string \| number \| symbol\]: client\[K\] \}\>

#### walletClient.key

> **key**: `string`

A key for the client.

#### walletClient.name

> **name**: `string`

A name for the client.

#### walletClient.pollingInterval

> **pollingInterval**: `number`

Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds.

#### walletClient.request

> **request**: `EIP1193RequestFn`\<\[\{ `Method`: `"web3_clientVersion"`; `Parameters?`: `undefined`; `ReturnType`: `string`; \}, \{ `Method`: `"web3_sha3"`; `Parameters`: \[`` `0x${string}` ``\]; `ReturnType`: `string`; \}, \{ `Method`: `"net_listening"`; `Parameters?`: `undefined`; `ReturnType`: `boolean`; \}, \{ `Method`: `"net_peerCount"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}, \{ `Method`: `"net_version"`; `Parameters?`: `undefined`; `ReturnType`: `` `0x${string}` ``; \}\]\>

Request function wrapped with friendly error handling

#### walletClient.transport

> **transport**: `TransportConfig`\<`string`, `EIP1193RequestFn`\> & `Record`\<`string`, `any`\>

The RPC transport

#### walletClient.type

> **type**: `string`

The type of client.

#### walletClient.uid

> **uid**: `string`

A unique ID for the client.

## Throws

Throws an error if the wallet is not connected, the address is missing,
or the viem client is unavailable.
