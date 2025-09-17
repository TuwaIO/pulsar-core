[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# signAndSendSolanaTx()

> **signAndSendSolanaTx**(`params`): `Promise`\<`string`\>

Defined in: [packages/pulsar-solana/src/utils/signAndSendSolanaTx.ts:34](https://github.com/TuwaIO/pulsar-core/blob/16038c5bbc96d2d466608fdc95d4789c6f06d211/packages/pulsar-solana/src/utils/signAndSendSolanaTx.ts#L34)

Creates, signs, and sends a Solana transaction with one or more instructions.

This async function orchestrates the common flow for broadcasting a transaction:
1. Fetches the latest blockhash from the RPC.
2. Creates a versioned transaction (`v0`).
3. Signs the transaction with the provided signer.
4. Sends the transaction to the network.
5. Decodes and returns the resulting transaction signature.

## Parameters

### params

The parameters for signing and sending the transaction.

#### client

`SolanaClient`

The Solana client instance for RPC communication.

#### instruction

`Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\> \| `Instruction`\<`string`, readonly (`AccountLookupMeta`\<`string`, `string`\> \| `AccountMeta`\<`string`\>)[]\>[]

A single instruction or an array of instructions to include in the transaction.

#### signer

`TransactionSendingSigner`

The signer (e.g., a wallet) responsible for signing the transaction.

## Returns

`Promise`\<`string`\>

A promise that resolves to the transaction signature.

## Throws

Will throw an error if any of the async operations (fetching blockhash, signing, sending) fail.

## Example

```ts
const signature = await signAndSendSolanaTx({
client: mySolanaClient,
signer: wallet,
instruction: myTransferInstruction,
});
console.log('Transaction sent with signature:', signature);
```
