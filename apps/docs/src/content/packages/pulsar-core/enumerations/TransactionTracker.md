# TransactionTracker

Defined in: [packages/pulsar-core/src/types.ts:24](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L24)

Tracking strategy of a transaction. The chain adapter picks it after the action returns (see
`TxAdapter.checkTransactionsTracker`) and routes the transaction to the matching tracker.

## Enumeration Members

### EIP5792

> **EIP5792**: `"eip5792"`

Defined in: [packages/pulsar-core/src/types.ts:37](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L37)

A batch of calls sent with EIP-5792 `wallet_sendCalls`, tracked by its batch ID through the wallet's
`wallet_getCallsStatus` and then on-chain (`@tuwaio/pulsar-evm`).

***

### ERC4337

> **ERC4337**: `"erc4337"`

Defined in: [packages/pulsar-core/src/types.ts:32](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L32)

An ERC-4337 UserOperation, tracked by its `userOpHash` through a bundler RPC and then on-chain.

***

### Ethereum

> **Ethereum**: `"ethereum"`

Defined in: [packages/pulsar-core/src/types.ts:26](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L26)

A standard EVM transaction, tracked by its hash through RPC (`@tuwaio/pulsar-evm`).

***

### Safe

> **Safe**: `"safe"`

Defined in: [packages/pulsar-core/src/types.ts:28](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L28)

A Safe multisig transaction, tracked by its `safeTxHash` through the Safe Transaction Service API.

***

### Solana

> **Solana**: `"solana"`

Defined in: [packages/pulsar-core/src/types.ts:30](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L30)

A Solana transaction, tracked by its signature through RPC (`@tuwaio/pulsar-solana`).
