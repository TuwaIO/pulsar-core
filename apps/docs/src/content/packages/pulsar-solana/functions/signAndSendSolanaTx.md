# signAndSendSolanaTx()

> **signAndSendSolanaTx**(`params`): `Promise`\<`string`\>

Defined in: [utils/signAndSendSolanaTx.ts:42](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/utils/signAndSendSolanaTx.ts#L42)

Builds a version 0 transaction with the given instructions, the signer as fee payer and the latest blockhash, then
has the signer sign and send it. Use it inside an `actionFunction`: the returned signature is the `txKey` the Solana
tracker follows. The tracker also gets the last valid block height of the blockhash, saves it as
`lastValidBlockHeight` and fails the transaction as soon as the chain passes that height without it.

Side effects: calls `getLatestBlockhash` through `client.rpc`, asks the wallet behind `signer` to sign and send the
transaction, and keeps the last valid block height in memory until the tracker of the signature takes it.

## Parameters

### params

The client, the signer and the instructions.

#### client

`SolanaClient`

A Solana client, for example from `createSolanaClientWithCache` of `@tuwaio/orbit-solana`.

#### instruction

`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\> \| `Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>[]

One instruction or an array of instructions.

#### signer

`TransactionSendingSigner`

A `TransactionSendingSigner`, such as the one from `createSolanaTransactionSendingSigner` of
`@tuwaio/orbit-solana` (0.5 and later) or `useWalletAccountTransactionSendingSigner` of `@solana/react`; it pays the
fee.

## Returns

`Promise`\<`string`\>

The transaction signature, base58-encoded.

## Throws

The error of the RPC call or of the signer (for example when the user rejects the transaction).

## Example

```ts
const signature = await signAndSendSolanaTx({ client, signer, instruction: transferInstruction });
```
