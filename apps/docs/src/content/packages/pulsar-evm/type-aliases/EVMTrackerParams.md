# EVMTrackerParams

> **EVMTrackerParams** = `object`

Defined in: [trackers/evmTracker.ts:99](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L99)

The configuration of [evmTracker](/packages/pulsar-evm/functions/evmTracker.md).

## Properties

### config

> **config**: `Config`

Defined in: [trackers/evmTracker.ts:106](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L106)

The wagmi config; the tracker uses its client for `tx.chainId`.

***

### onConfirmationsUpdate?

> `optional` **onConfirmationsUpdate?**: (`confirmations`) => `void`

Defined in: [trackers/evmTracker.ts:140](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L140)

Called while waiting for `requiredConfirmations` (only when it is above 1).

#### Parameters

##### confirmations

`number`

The current number of confirmations.

#### Returns

`void`

***

### onFailure

> **onFailure**: (`error?`) => `void`

Defined in: [trackers/evmTracker.ts:129](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L129)

Called once when tracking gives up (see [evmTracker](/packages/pulsar-evm/functions/evmTracker.md)).

#### Parameters

##### error?

`unknown`

The last error.

#### Returns

`void`

***

### onInitialize?

> `optional` **onInitialize?**: () => `void`

Defined in: [trackers/evmTracker.ts:131](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L131)

Called once, before anything else.

#### Returns

`void`

***

### onReplaced

> **onReplaced**: (`replacement`) => `void`

Defined in: [trackers/evmTracker.ts:124](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L124)

Called when viem detects that another transaction with the same nonce replaced this one (speed-up or cancel).

#### Parameters

##### replacement

`ReplacementReturnType`

viem's replacement data: the `reason` and the replacing `transaction`.

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`txDetails`, `receipt`, `client`) => `Promise`\<`void`\>

Defined in: [trackers/evmTracker.ts:119](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L119)

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

Defined in: [trackers/evmTracker.ts:111](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L111)

Called once with the result of `getTransaction`.

#### Parameters

##### txDetails

`GetTransactionReturnType`

The transaction: nonce, fees, `to`, `value`, `input`.

#### Returns

`void`

***

### retryCount?

> `optional` **retryCount?**: `number`

Defined in: [trackers/evmTracker.ts:133](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L133)

Number of `getTransaction` attempts. Defaults to 10.

***

### retryTimeout?

> `optional` **retryTimeout?**: `number`

Defined in: [trackers/evmTracker.ts:135](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L135)

Delay between `getTransaction` attempts, in milliseconds. Defaults to 3000.

***

### tx

> **tx**: `Pick`\<[`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md), `"chainId"` \| `"txKey"` \| `"requiredConfirmations"`\>

Defined in: [trackers/evmTracker.ts:104](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L104)

The transaction: its hash (`txKey`), its numeric `chainId` (which must be configured in `config`) and, optionally,
the number of confirmations to wait for.

***

### waitForTransactionReceiptParams?

> `optional` **waitForTransactionReceiptParams?**: `WaitForTransactionReceiptParameters`

Defined in: [trackers/evmTracker.ts:145](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/evmTracker.ts#L145)

Options for viem's `waitForTransactionReceipt`, merged over the defaults (`retryCount: 10`, `retryDelay: 3000`,
`timeout: 60000`).
