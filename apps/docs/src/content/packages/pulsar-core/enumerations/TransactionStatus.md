# TransactionStatus

Defined in: [packages/pulsar-core/src/types.ts:43](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L43)

Terminal status of a transaction. Trackers set it together with `pending: false`.

## Enumeration Members

### Failed

> **Failed**: `"Failed"`

Defined in: [packages/pulsar-core/src/types.ts:45](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L45)

The transaction reverted, was rejected, or tracking failed (for example, it was not found in time).

***

### Replaced

> **Replaced**: `"Replaced"`

Defined in: [packages/pulsar-core/src/types.ts:52](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L52)

Another transaction with the same nonce was mined instead (a wallet speed-up or cancel). The record stays. After a
speed-up the operation goes on in a new record under the new hash (`replaces`), which has its own result.

***

### Success

> **Success**: `"Success"`

Defined in: [packages/pulsar-core/src/types.ts:47](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/types.ts#L47)

The transaction was included on-chain and executed successfully.
