[**API Reference.**](../../../README.md)

***

# EVMTrackerParams

> **EVMTrackerParams** = `object`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:93](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L93)

Defines the parameters for the low-level EVM transaction tracker.

## Properties

### config

> **config**: `Config`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:97](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L97)

The `@wagmi/core` configuration instance used to resolve network clients.

***

### onConfirmationsUpdate?

> `optional` **onConfirmationsUpdate?**: (`confirmations`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:113](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L113)

Optional callback fired whenever required block confirmation count updates.

#### Parameters

##### confirmations

`number`

#### Returns

`void`

***

### onFailure

> **onFailure**: (`error?`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:105](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L105)

Callback fired when tracking fails fatally or exceeds all retry attempts.

#### Parameters

##### error?

`unknown`

#### Returns

`void`

***

### onInitialize?

> `optional` **onInitialize?**: () => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:107](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L107)

Optional callback fired when tracker initialization starts.

#### Returns

`void`

***

### onReplaced

> **onReplaced**: (`replacement`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:103](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L103)

Callback fired when the transaction has been replaced (repriced or cancelled).

#### Parameters

##### replacement

`ReplacementReturnType`

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`txDetails`, `receipt`, `client`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:101](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L101)

Callback fired when the transaction is mined successfully (or reverted on-chain).

#### Parameters

##### txDetails

`GetTransactionReturnType`

##### receipt

`TransactionReceipt`

##### client

`Client`

#### Returns

`Promise`\<`void`\>

***

### onTxDetailsFetched

> **onTxDetailsFetched**: (`txDetails`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:99](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L99)

Callback fired once transaction details (nonce, input, values) are successfully fetched.

#### Parameters

##### txDetails

`GetTransactionReturnType`

#### Returns

`void`

***

### retryCount?

> `optional` **retryCount?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:109](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L109)

Number of retries for the initial `getTransaction` fetch step. Defaults to 10.

***

### retryTimeout?

> `optional` **retryTimeout?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:111](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L111)

Timeout in milliseconds between `getTransaction` retry attempts. Defaults to 3000ms.

***

### tx

> **tx**: `Pick`\<`Transaction`, `"chainId"` \| `"txKey"` \| `"requiredConfirmations"`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:95](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L95)

The transaction identity parameters (chainId, txKey, requiredConfirmations).

***

### waitForTransactionReceiptParams?

> `optional` **waitForTransactionReceiptParams?**: `WaitForTransactionReceiptParameters`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:115](https://github.com/TuwaIO/pulsar-core/blob/39a0d2c484c435456f9a8bddf17d40cdfe938312/packages/pulsar-evm/src/trackers/evmTracker.ts#L115)

Optional custom parameters passed directly to viem's `waitForTransactionReceipt`.
