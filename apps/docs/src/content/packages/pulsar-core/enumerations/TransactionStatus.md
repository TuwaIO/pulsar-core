# TransactionStatus

Defined in: [types.ts:48](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L48)

Terminal status of a transaction. Trackers set it together with `pending: false`.

## Enumeration Members

### Failed

> **Failed**: `"Failed"`

Defined in: [types.ts:50](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L50)

The transaction reverted, was rejected, or tracking failed (for example, it was not found in time).

***

### Replaced

> **Replaced**: `"Replaced"`

Defined in: [types.ts:54](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L54)

Another transaction with the same nonce was mined instead (a wallet speed-up or cancel).

***

### Success

> **Success**: `"Success"`

Defined in: [types.ts:52](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L52)

The transaction was included on-chain and executed successfully.
