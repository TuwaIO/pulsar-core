[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# EvmTransaction\<T\>

> **EvmTransaction**\<`T`\> = [`BaseTransaction`](BaseTransaction.md)\<`T`\> & `object`

Defined in: [packages/pulsar-core/src/types.ts:90](https://github.com/TuwaIO/pulsar-core/blob/3dd99361d439c3516b34d795b4c0fe6affcc943c/packages/pulsar-core/src/types.ts#L90)

Represents an EVM-specific transaction, extending the base properties.

## Type declaration

### adapter

> **adapter**: [`EVM`](../enumerations/TransactionAdapter.md#evm)

The transaction adapter type.

### hash?

> `optional` **hash**: `string`

The on-chain transaction hash, available after submission.

### input?

> `optional` **input**: `string`

The data payload for the transaction, typically for contract interactions.

### maxFeePerGas?

> `optional` **maxFeePerGas**: `string`

The maximum fee per gas for the transaction (EIP-1559).

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `string`

The maximum priority fee per gas for the transaction (EIP-1559).

### nonce?

> `optional` **nonce**: `number`

The transaction nonce.

### replacedTxHash?

> `optional` **replacedTxHash**: `string`

The hash of a transaction that this one replaced (e.g., for speed-up).

### to?

> `optional` **to**: `string`

The recipient's address.

### value?

> `optional` **value**: `string`

The value (in wei) being sent with the transaction.

## Type Parameters

### T

`T`

The type of the tracker identifier.
