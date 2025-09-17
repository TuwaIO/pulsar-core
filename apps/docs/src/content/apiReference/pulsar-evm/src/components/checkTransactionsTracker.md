[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkTransactionsTracker()

> **checkTransactionsTracker**(`actionTxKey`, `walletType`): `object`

Defined in: [packages/pulsar-evm/src/utils/checkTransactionsTracker.ts:28](https://github.com/TuwaIO/pulsar-core/blob/e4e6c80b06717a36e79850d69c03d964005053f1/packages/pulsar-evm/src/utils/checkTransactionsTracker.ts#L28)

Determines which transaction tracker to use based on the format of the transaction key and the wallet type.

This function is a critical routing step after a transaction is submitted. It inspects
the key returned by the `actionFunction` and the wallet type to decide the tracking strategy.
The logic follows a specific priority:
1. Checks for a Gelato Task ID structure.
2. Checks if the wallet type indicates a Safe transaction.
3. Defaults to the standard on-chain EVM hash tracker.

## Parameters

### actionTxKey

[`ActionTxKey`](../type-aliases/ActionTxKey.md)

The key returned from the transaction submission function (e.g., a hash or a Gelato task object).

### walletType

`string`

The type of the wallet that initiated the action (e.g., 'safe', 'injected').

## Returns

`object`

An object containing the determined tracker type and the final string-based transaction key.

### tracker

> **tracker**: [`TransactionTracker`](../enumerations/TransactionTracker.md)

### txKey

> **txKey**: `string`

## Throws

Throws an error if the `actionTxKey` is not a valid Hex string after failing the Gelato check.
