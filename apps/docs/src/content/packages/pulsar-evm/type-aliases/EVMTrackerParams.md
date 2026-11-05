# EVMTrackerParams

> **EVMTrackerParams** = `object`

Defined in: [trackers/evmTracker.ts:42](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L42)

The configuration of [evmTracker](/packages/pulsar-evm/functions/evmTracker.md).

## Properties

### config

> **config**: `Config`

Defined in: [trackers/evmTracker.ts:49](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L49)

The wagmi config; the tracker uses its client for `tx.chainId`.

***

### knownDetails?

> `optional` **knownDetails?**: [`NonceSlot`](/packages/pulsar-evm/type-aliases/NonceSlot.md)

Defined in: [trackers/evmTracker.ts:55](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L55)

What an earlier run read of this transaction. A node may no longer return a replaced hash, and then only these can
tell what became of it, so save them when `onTxDetailsFetched` runs and pass them after a reload or a restart.
Use the sender from `getTransaction`: for a relayed transaction it is the relayer, not the wallet.

***

### notFoundUntil?

> `optional` **notFoundUntil?**: `number`

Defined in: [trackers/evmTracker.ts:92](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L92)

When to stop looking for a hash the node has never shown, in milliseconds since the epoch. Past `retryCount`
attempts it looks every 30 s. Defaults to stopping after `retryCount` attempts.

***

### onConfirmationsUpdate?

> `optional` **onConfirmationsUpdate?**: (`confirmations`) => `void`

Defined in: [trackers/evmTracker.ts:104](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L104)

Called while waiting for `requiredConfirmations` (only when it is above 1).

#### Parameters

##### confirmations

`number`

The current number of confirmations.

#### Returns

`void`

***

### onFailure

> **onFailure**: (`error?`) => `Promise`\<`void`\> \| `void`

Defined in: [trackers/evmTracker.ts:81](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L81)

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

Defined in: [trackers/evmTracker.ts:83](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L83)

Called once, before anything else.

#### Returns

`void`

***

### onReplaced

> **onReplaced**: (`replacement`) => `Promise`\<`void`\> \| `void`

Defined in: [trackers/evmTracker.ts:75](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L75)

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

Defined in: [trackers/evmTracker.ts:68](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L68)

Called and awaited once the receipt is available and the required confirmations are reached. Also called for
reverted transactions: check `receipt.status`.

#### Parameters

##### txDetails

`GetTransactionReturnType`

The result of `getTransaction`.

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

Defined in: [trackers/evmTracker.ts:60](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L60)

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

Defined in: [trackers/evmTracker.ts:99](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L99)

How many times to wait for the receipt, each up to the `timeout` of `waitForTransactionReceiptParams`, with pauses
of 5, 10, 15 s and so on, up to 30 s. Between attempts the tracker reads the nonce of the sender. Defaults to 6, 435 s
in all with the default `timeout`. `Infinity` waits until there is a receipt or a replacement: a slow transaction is
not a failed one.

***

### retryCount?

> `optional` **retryCount?**: `number`

Defined in: [trackers/evmTracker.ts:85](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L85)

Number of `getTransaction` attempts. Defaults to 10.

***

### retryTimeout?

> `optional` **retryTimeout?**: `number`

Defined in: [trackers/evmTracker.ts:87](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L87)

Delay between `getTransaction` attempts, in milliseconds. Defaults to 3000.

***

### tx

> **tx**: `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"chainId"` \| `"txKey"` \| `"requiredConfirmations"`\>

Defined in: [trackers/evmTracker.ts:47](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L47)

The transaction: its hash (`txKey`), its numeric `chainId` (which must be configured in `config`) and, optionally,
the number of confirmations to wait for.

***

### waitForTransactionReceiptParams?

> `optional` **waitForTransactionReceiptParams?**: `WaitForTransactionReceiptParameters`

Defined in: [trackers/evmTracker.ts:109](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L109)

Options for viem's `waitForTransactionReceipt`, merged over the defaults (`retryCount: 10`, `retryDelay: 3000`,
`timeout: 60000`).
