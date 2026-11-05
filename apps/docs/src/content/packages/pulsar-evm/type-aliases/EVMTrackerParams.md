# EVMTrackerParams

> **EVMTrackerParams** = `object`

Defined in: [trackers/evmTracker.ts:92](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L92)

The configuration of [evmTracker](/packages/pulsar-evm/functions/evmTracker.md).

## Properties

### config

> **config**: `Config`

Defined in: [trackers/evmTracker.ts:99](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L99)

The wagmi config; the tracker uses its client for `tx.chainId`.

***

### confirmationsTimeout?

> `optional` **confirmationsTimeout?**: `number`

Defined in: [trackers/evmTracker.ts:160](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L160)

How long a mined transaction may wait for its confirmations, in milliseconds, before `onFailure` gets
[ConfirmationsTimeoutError](/packages/pulsar-evm/classes/ConfirmationsTimeoutError.md). Defaults to no limit. Set it on a server, or one chain that makes no blocks would hold a
job for good.

***

### isAbandoned?

> `optional` **isAbandoned?**: () => `boolean`

Defined in: [trackers/evmTracker.ts:166](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L166)

Asked before every lookup and every attempt. `true` ends tracking without any callback: nothing reads the result any
more, for example as the transaction was removed from the pool.

#### Returns

`boolean`

Whether to stop.

***

### knownDetails?

> `optional` **knownDetails?**: [`NonceSlot`](/packages/pulsar-evm/type-aliases/NonceSlot.md)

Defined in: [trackers/evmTracker.ts:105](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L105)

What an earlier run read of this transaction. A node may no longer return a replaced hash, and then only these can
tell what became of it, so save them when `onTxDetailsFetched` runs and pass them after a reload or a restart.
Use the sender from `getTransaction`: for a relayed transaction it is the relayer, not the wallet.

***

### notFoundUntil?

> `optional` **notFoundUntil?**: `number`

Defined in: [trackers/evmTracker.ts:146](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L146)

When to stop looking for a hash the node has never shown, in milliseconds since the epoch. Past `retryCount`
attempts it looks every 30 s, and only the node answering that it has no such transaction ends it, not an RPC error.
Defaults to stopping after `retryCount` attempts.

***

### onConfirmationsUpdate?

> `optional` **onConfirmationsUpdate?**: (`confirmations`) => `Promise`\<`void`\> \| `void`

Defined in: [trackers/evmTracker.ts:171](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L171)

Called and awaited while waiting for `requiredConfirmations` (only when it is above 1). An error it throws is logged.

#### Parameters

##### confirmations

`number`

The current number of confirmations.

#### Returns

`Promise`\<`void`\> \| `void`

***

### onFailure

> **onFailure**: (`error?`) => `Promise`\<`void`\> \| `void`

Defined in: [trackers/evmTracker.ts:134](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L134)

Called and awaited once when tracking gives up (see [evmTracker](/packages/pulsar-evm/functions/evmTracker.md)).

#### Parameters

##### error?

`unknown`

The last error: [NonceSlotSpentError](/packages/pulsar-evm/classes/NonceSlotSpentError.md) when the transaction can never land, but what spent its
nonce could not be found, so money may have moved, and [ConfirmationsTimeoutError](/packages/pulsar-evm/classes/ConfirmationsTimeoutError.md) for a mined transaction past
`confirmationsTimeout`.

#### Returns

`Promise`\<`void`\> \| `void`

***

### onInitialize?

> `optional` **onInitialize?**: () => `void`

Defined in: [trackers/evmTracker.ts:136](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L136)

Called once, before anything else.

#### Returns

`void`

***

### onReplaced

> **onReplaced**: (`replacement`) => `Promise`\<`void`\> \| `void`

Defined in: [trackers/evmTracker.ts:127](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L127)

Called and awaited when another transaction spent this one's nonce (speed-up, cancel or any other transaction), as soon
as it is seen in a block. To follow that transaction to its own confirmations, track its hash. An error it throws is
logged.

#### Parameters

##### replacement

`ReplacementReturnType`

viem's replacement data: the `reason` (`repriced`, `cancelled`, `replaced`) and the replacing
`transaction` with its receipt.

#### Returns

`Promise`\<`void`\> \| `void`

***

### onSuccess

> **onSuccess**: (`txDetails`, `receipt`, `client`) => `Promise`\<`void`\>

Defined in: [trackers/evmTracker.ts:119](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L119)

Called and awaited once the receipt is available and the required confirmations are reached. Also called for
reverted transactions: check `receipt.status`.

#### Parameters

##### txDetails

`GetTransactionReturnType`

The result of `getTransaction`. With `knownDetails`, when the node kept failing to return a
transaction it has a receipt for, it is built from `knownDetails` and the receipt: the receipt is proof enough.

##### receipt

`TransactionReceipt`

The transaction receipt.

##### client

`Client`

The viem client of the chain, for further RPC calls.

#### Returns

`Promise`\<`void`\>

***

### onTxDetailsFetched

> **onTxDetailsFetched**: (`txDetails`) => `void`

Defined in: [trackers/evmTracker.ts:110](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L110)

Called once with the result of `getTransaction`.

#### Parameters

##### txDetails

`GetTransactionReturnType`

The transaction: nonce, fees, `to`, `value`, `input`.

#### Returns

`void`

***

### receiptAttempts?

> `optional` **receiptAttempts?**: `number`

Defined in: [trackers/evmTracker.ts:154](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L154)

How long to wait for the receipt, as a number of attempts of up to the `timeout` of
`waitForTransactionReceiptParams`, with pauses of 5, 10, 15 s and so on, up to 30 s: 6 attempts, the default, are 435 s
with the default `timeout`. It is a limit in time: an attempt ended early by an RPC error is only followed by another.
Between attempts the tracker reads the nonce of the sender. `Infinity` waits until there is a receipt or a replacement:
a slow transaction is not a failed one.

***

### retryCount?

> `optional` **retryCount?**: `number`

Defined in: [trackers/evmTracker.ts:138](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L138)

Number of `getTransaction` attempts. With `notFoundUntil` it only sets how many are made 3 s apart. Defaults to 10.

***

### retryTimeout?

> `optional` **retryTimeout?**: `number`

Defined in: [trackers/evmTracker.ts:140](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L140)

Delay between `getTransaction` attempts, in milliseconds. Defaults to 3000.

***

### tx

> **tx**: `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"chainId"` \| `"txKey"` \| `"requiredConfirmations"`\>

Defined in: [trackers/evmTracker.ts:97](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L97)

The transaction: its hash (`txKey`), its numeric `chainId` (which must be configured in `config`) and, optionally,
the number of confirmations to wait for.

***

### waitForTransactionReceiptParams?

> `optional` **waitForTransactionReceiptParams?**: `WaitForTransactionReceiptParameters`

Defined in: [trackers/evmTracker.ts:176](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L176)

Options for viem's `waitForTransactionReceipt`, merged over the defaults (`retryCount: 10`, `retryDelay: 3000`,
`timeout: 60000`).
