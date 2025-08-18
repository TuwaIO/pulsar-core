[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkTransactionsTracker()

> **checkTransactionsTracker**(`actionTxKey`, `walletType`): `object`

Defined in: [packages/pulsar-evm/src/utils/checkTransactionsTracker.ts:24](https://github.com/TuwaIO/pulsar-core/blob/dbac4ff9fac5e788ddd51c1eb159f621106ceb73/packages/pulsar-evm/src/utils/checkTransactionsTracker.ts#L24)

Determines which transaction tracker to use based on the format of the transaction key and the wallet type.

This function is a critical routing step after a transaction is submitted.
It follows a priority order:
1. Checks for a Gelato Task ID.
2. Checks if the wallet type is 'safe'.
3. Defaults to a standard Ethereum tracker.

## Parameters

### actionTxKey

[`ActionTxKey`](../type-aliases/ActionTxKey.md)

The key returned from the transaction submission function (e.g., a hash or a Gelato task object).

### walletType

`string`

The type of the wallet that initiated the action (e.g., 'safe', 'metaMask').

## Returns

`object`

An object containing the determined tracker type and the final string-based transaction key.

### tracker

> **tracker**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

### txKey

> **txKey**: `string`
