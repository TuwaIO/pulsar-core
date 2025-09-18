[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# EvmTransaction

> **EvmTransaction** = [`BaseTransaction`](BaseTransaction.md) & `object`

Defined in: [packages/pulsar-core/src/types.ts:150](https://github.com/TuwaIO/pulsar-core/blob/c81eb98e6cdcf718f4d05b7d7444cbfda0dec5d9/packages/pulsar-core/src/types.ts#L150)

Represents an EVM-specific transaction, extending the base properties with EVM fields.

## Type Declaration

### adapter

> **adapter**: [`EVM`](../enumerations/TransactionAdapter.md#evm)

### hash?

> `optional` **hash**: `` `0x${string}` ``

The on-chain transaction hash, available after submission.

### input?

> `optional` **input**: `` `0x${string}` ``

The data payload for the transaction, typically for smart contract interactions.

### maxFeePerGas?

> `optional` **maxFeePerGas**: `string`

The maximum fee per gas for an EIP-1559 transaction (in wei).

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `string`

The maximum priority fee per gas for an EIP-1559 transaction (in wei).

### nonce?

> `optional` **nonce**: `number`

The transaction nonce, a sequential number for the sender's account.

### replacedTxHash?

> `optional` **replacedTxHash**: `` `0x${string}` ``

The hash of a transaction that this one replaced.

### to?

> `optional` **to**: `` `0x${string}` ``

The recipient's address or contract address.

### value?

> `optional` **value**: `string`

The amount of native currency (in wei) being sent.
