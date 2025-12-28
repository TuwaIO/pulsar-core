[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkTransactionsTracker()

> **checkTransactionsTracker**(`actionTxKey`, `connectorType`): `object`

Defined in: [packages/pulsar-evm/src/utils/checkTransactionsTracker.ts:28](https://github.com/TuwaIO/pulsar-core/blob/7cdb31cafd7b0529c61bfcff5d12e1982653bf85/packages/pulsar-evm/src/utils/checkTransactionsTracker.ts#L28)

Determines which transaction tracker to use based on the format of the transaction key and the connector type.

This function is a critical routing step after a transaction is submitted. It inspects
the key returned by the `actionFunction` and the connector type to decide the tracking strategy.
The logic follows a specific priority:
1. Checks for a Gelato Task ID structure.
2. Checks if the connector type indicates a Safe transaction.
3. Defaults to the standard on-chain EVM hash tracker.

## Parameters

### actionTxKey

`ActionTxKey`

The key returned from the transaction submission function (e.g., a hash or a Gelato task object).

### connectorType

`string`

The type of the connector that initiated the action (e.g., 'safe', 'injected').

## Returns

`object`

An object containing the determined tracker type and the final string-based transaction key.

### tracker

> **tracker**: `TransactionTracker`

### txKey

> **txKey**: `string`

## Throws

Throws an error if the `actionTxKey` is not a valid Hex string after failing the Gelato check.
