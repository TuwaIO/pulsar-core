# EVMTrackerParams

> **EVMTrackerParams** = `object`

Defined in: [trackers/evmTracker.ts:48](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L48)

The configuration of [evmTracker](/packages/pulsar-evm/functions/evmTracker.md).

## Properties

### config

> **config**: `Config`

Defined in: [trackers/evmTracker.ts:55](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L55)

The wagmi config; the tracker uses its client for `tx.chainId`.

***

### isAbandoned?

> `optional` **isAbandoned?**: () => `boolean`

Defined in: [trackers/evmTracker.ts:118](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L118)

Asked before every lookup and every attempt. `true` ends tracking without any callback: nothing reads the result any
more, for example as the transaction was removed from the pool.

#### Returns

`boolean`

Whether to stop.

***

### knownDetails?

> `optional` **knownDetails?**: [`NonceSlot`](/packages/pulsar-evm/type-aliases/NonceSlot.md)

Defined in: [trackers/evmTracker.ts:61](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L61)

What an earlier run read of this transaction. A node may no longer return a replaced hash, and then only these can
tell what became of it, so save them when `onTxDetailsFetched` runs and pass them after a reload or a restart.
Use the sender from `getTransaction`: for a relayed transaction it is the relayer, not the wallet.

***

### notFoundUntil?

> `optional` **notFoundUntil?**: `number`

Defined in: [trackers/evmTracker.ts:104](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L104)

When to stop looking for a hash the node has never shown, in milliseconds since the epoch. Past `retryCount`
attempts it looks every 30 s, and only the node answering that it has no such transaction ends it, not an RPC error.
Defaults to stopping after `retryCount` attempts.

***

### onConfirmationsUpdate?

> `optional` **onConfirmationsUpdate?**: (`confirmations`) => `Promise`\<`void`\> \| `void`

Defined in: [trackers/evmTracker.ts:123](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L123)

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

Defined in: [trackers/evmTracker.ts:92](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L92)

Called and awaited once when tracking gives up (see [evmTracker](/packages/pulsar-evm/functions/evmTracker.md)).

#### Parameters

##### error?

`unknown`

The last error: [NonceSlotSpentError](/packages/pulsar-evm/classes/NonceSlotSpentError.md) when the transaction can never land, but what spent its
nonce could not be found, so money may have moved.

#### Returns

`Promise`\<`void`\> \| `void`

***

### onInitialize?

> `optional` **onInitialize?**: () => `void`

Defined in: [trackers/evmTracker.ts:94](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L94)

Called once, before anything else.

#### Returns

`void`

***

### onReplaced

> **onReplaced**: (`replacement`) => `Promise`\<`void`\> \| `void`

Defined in: [trackers/evmTracker.ts:86](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L86)

Called and awaited when another transaction spent this one's nonce (speed-up, cancel or any other transaction), once
that transaction has the required confirmations. An error it throws is logged.

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

Defined in: [trackers/evmTracker.ts:75](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L75)

Called and awaited once the receipt is available and the required confirmations are reached. Also called for
reverted transactions: check `receipt.status`.

#### Parameters

##### txDetails

`GetTransactionReturnType` \| `undefined`

The result of `getTransaction`, or `undefined` when the node kept failing to return it for a
transaction it has a receipt for: the receipt is proof enough.

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

Defined in: [trackers/evmTracker.ts:66](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L66)

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

Defined in: [trackers/evmTracker.ts:112](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L112)

How long to wait for the receipt, as a number of attempts of up to the `timeout` of
`waitForTransactionReceiptParams`, with pauses of 5, 10, 15 s and so on, up to 30 s: 6 attempts, the default, are 435 s
with the default `timeout`. It is a limit in time: an attempt ended early by an RPC error is only followed by another.
Between attempts the tracker reads the nonce of the sender. `Infinity` waits until there is a receipt or a replacement:
a slow transaction is not a failed one.

***

### retryCount?

> `optional` **retryCount?**: `number`

Defined in: [trackers/evmTracker.ts:96](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L96)

Number of `getTransaction` attempts. With `notFoundUntil` it only sets how many are made 3 s apart. Defaults to 10.

***

### retryTimeout?

> `optional` **retryTimeout?**: `number`

Defined in: [trackers/evmTracker.ts:98](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L98)

Delay between `getTransaction` attempts, in milliseconds. Defaults to 3000.

***

### tx

> **tx**: `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"chainId"` \| `"txKey"` \| `"requiredConfirmations"`\>

Defined in: [trackers/evmTracker.ts:53](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L53)

The transaction: its hash (`txKey`), its numeric `chainId` (which must be configured in `config`) and, optionally,
the number of confirmations to wait for.

***

### waitForTransactionReceiptParams?

> `optional` **waitForTransactionReceiptParams?**: `WaitForTransactionReceiptParameters`

Defined in: [trackers/evmTracker.ts:128](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L128)

Options for viem's `waitForTransactionReceipt`, merged over the defaults (`retryCount: 10`, `retryDelay: 3000`,
`timeout: 60000`).
