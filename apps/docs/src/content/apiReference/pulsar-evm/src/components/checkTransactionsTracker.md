[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkTransactionsTracker()

> **checkTransactionsTracker**(`actionTxKey`): `object`

Defined in: [packages/pulsar-evm/src/utils/checkTransactionsTracker.ts:27](https://github.com/TuwaIO/pulsar-core/blob/5f182e29003409398051d1d02ec9c947396d97e5/packages/pulsar-evm/src/utils/checkTransactionsTracker.ts#L27)

Determines which transaction tracker to use based on the format of the transaction key and the connector type.

This function is a critical routing step after a transaction is submitted. It inspects
the key returned by the `actionFunction` and the connector type to decide the tracking strategy.
The logic follows a specific priority:
1. Checks for a Gelato Task ID structure.
2. Checks if the connector type indicates a Safe transaction.
3. Defaults to the standard on-chain EVM hash tracker.

## Parameters

### actionTxKey

`CheckTxTracker`

The key returned from the transaction submission function (e.g., a hash or a Gelato task object).

## Returns

`object`

An object containing the determined tracker type and the final string-based transaction key.

### tracker

> **tracker**: `TransactionTracker`

### txKey

> **txKey**: `string`

## Throws

Throws an error if the `actionTxKey` is not a valid Hex string after failing the Gelato check.
