# EvmTransaction

> **EvmTransaction** = [`BaseTransaction`](/packages/pulsar-core/type-aliases/BaseTransaction.md) & `object`

Defined in: [types.ts:164](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L164)

An EVM transaction. Trackers fill the on-chain fields (`hash`, `nonce`, fees, `to`, `value`, `input`) once the
transaction details are available.

## Type Declaration

### adapter

> **adapter**: `OrbitAdapter.EVM`

Always `OrbitAdapter.EVM`.

### bundlerUrl?

> `optional` **bundlerUrl?**: `string`

Custom bundler RPC URL used to track an ERC-4337 UserOperation. Stored with the transaction, so it is persisted to
`localStorage` and passed to `onRemoteCreate` (a backend can track through the same bundler). Keep API keys out of
this URL; pass them as `pimlicoApiKey`.

### hash?

> `optional` **hash?**: `` `0x${string}` ``

The on-chain transaction hash: the `txKey` for standard transactions, and the hash of the mined transaction for
ERC-4337, Safe and Gelato once it is known.

### input?

> `optional` **input?**: `` `0x${string}` ``

The calldata of the transaction.

### maxFeePerGas?

> `optional` **maxFeePerGas?**: `string`

EIP-1559 max fee per gas, in wei, as a decimal string.

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas?**: `string`

EIP-1559 max priority fee per gas, in wei, as a decimal string.

### nonce?

> `optional` **nonce?**: `number`

The nonce of the sender account.

### pimlicoApiKey?

> `optional` **pimlicoApiKey?**: `string`

Pimlico API key used to track an ERC-4337 UserOperation when no `bundlerUrl` is set. Persisted to `localStorage`
with the transaction, so tracking can resume after a reload, but never passed to `onRemoteCreate`.

### replacedTxHash?

> `optional` **replacedTxHash?**: `` `0x${string}` ``

The hash of the transaction that replaced this one (set with `status: Replaced`). For Safe transactions it is the
`safeTxHash` of the transaction executed instead.

### to?

> `optional` **to?**: `` `0x${string}` ``

The recipient or contract address.

### value?

> `optional` **value?**: `string`

The native value sent, in wei, as a decimal string.
