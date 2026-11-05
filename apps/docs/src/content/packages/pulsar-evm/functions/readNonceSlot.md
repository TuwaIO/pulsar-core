# readNonceSlot()

> **readNonceSlot**(`client`, `params`): `Promise`\<[`NonceSlotReading`](/packages/pulsar-evm/type-aliases/NonceSlotReading.md)\>

Defined in: [utils/readNonceSlot.ts:136](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/utils/readNonceSlot.ts#L136)

Reads what became of a transaction from its sender and nonce. It works when the node no longer returns the hash, which
a node does once a replacement reaches its mempool, or when it drops a transaction whose fee fell too low, and it does
not depend on seeing the block the replacement landed in.

RPC calls: `eth_getTransactionCount`, the receipt of `hash`, and, once the nonce is spent,
`eth_getTransactionBySenderAndNonce` where the node has it, otherwise up to `maxBlocks` full blocks.

## Parameters

### client

`Client`

The viem client of the chain.

### params

The transaction and how far back to look.

#### fromBlock?

`bigint`

A block no replacement can be older than, when known.

#### hash

`` `0x${string}` ``

The hash of the tracked transaction.

#### maxBlocks?

`number`

The most blocks to read. Defaults to 1000.

#### slot

[`NonceSlot`](/packages/pulsar-evm/type-aliases/NonceSlot.md)

Its sender and nonce.

## Returns

`Promise`\<[`NonceSlotReading`](/packages/pulsar-evm/type-aliases/NonceSlotReading.md)\>

What became of the transaction.

## Throws

The RPC error when the node cannot answer. Nothing is known then, so read it again later.

## Example

```ts
const reading = await readNonceSlot(client, { hash, slot: { from, nonce } });
if (reading.state === 'replaced') console.log('Replaced by', reading.replacement.transaction.hash);
```
