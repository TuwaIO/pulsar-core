# TransactionStatus

Defined in: [types.ts:43](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L43)

Terminal status of a transaction. Trackers set it together with `pending: false`.

## Enumeration Members

### Failed

> **Failed**: `"Failed"`

Defined in: [types.ts:45](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L45)

The transaction reverted, was rejected, or tracking failed (for example, it was not found in time).

***

### Replaced

> **Replaced**: `"Replaced"`

Defined in: [types.ts:49](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L49)

Another transaction with the same nonce was mined instead (a wallet speed-up or cancel).

***

### Success

> **Success**: `"Success"`

Defined in: [types.ts:47](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L47)

The transaction was included on-chain and executed successfully.
