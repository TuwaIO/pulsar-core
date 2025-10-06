[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# TransactionStatus

Defined in: [packages/pulsar-core/src/types.ts:21](https://github.com/TuwaIO/pulsar-core/blob/bdceb94ce44190f4d3014c2e4cf435b68c70b5b1/packages/pulsar-core/src/types.ts#L21)

Represents the terminal status of a transaction after it has been processed.

## Enumeration Members

### Failed

> **Failed**: `"Failed"`

Defined in: [packages/pulsar-core/src/types.ts:23](https://github.com/TuwaIO/pulsar-core/blob/bdceb94ce44190f4d3014c2e4cf435b68c70b5b1/packages/pulsar-core/src/types.ts#L23)

The transaction failed to execute due to an on-chain error or rejection.

***

### Replaced

> **Replaced**: `"Replaced"`

Defined in: [packages/pulsar-core/src/types.ts:27](https://github.com/TuwaIO/pulsar-core/blob/bdceb94ce44190f4d3014c2e4cf435b68c70b5b1/packages/pulsar-core/src/types.ts#L27)

The transaction was replaced by another with the same nonce (e.g., a speed-up or cancel).

***

### Success

> **Success**: `"Success"`

Defined in: [packages/pulsar-core/src/types.ts:25](https://github.com/TuwaIO/pulsar-core/blob/bdceb94ce44190f4d3014c2e4cf435b68c70b5b1/packages/pulsar-core/src/types.ts#L25)

The transaction was successfully mined and included in a block.
