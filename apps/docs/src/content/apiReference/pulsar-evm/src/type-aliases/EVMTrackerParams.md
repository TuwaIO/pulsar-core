[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# EVMTrackerParams

> **EVMTrackerParams** = `object`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:29](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L29)

Defines the parameters for the low-level EVM transaction tracker.

## Properties

### chains

> **chains**: `Chain`[]

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:31](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L31)

***

### onFailure()

> **onFailure**: (`error?`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L35)

#### Parameters

##### error?

`unknown`

#### Returns

`void`

***

### onInitialize()?

> `optional` **onInitialize**: () => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L36)

#### Returns

`void`

***

### onReplaced()

> **onReplaced**: (`replacement`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L34)

#### Parameters

##### replacement

`ReplacementReturnType`

#### Returns

`void`

***

### onSuccess()

> **onSuccess**: (`txDetails`, `receipt`, `client`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L33)

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

### onTxDetailsFetched()

> **onTxDetailsFetched**: (`txDetails`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:32](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L32)

#### Parameters

##### txDetails

`GetTransactionReturnType`

#### Returns

`void`

***

### retryCount?

> `optional` **retryCount**: `number`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L37)

***

### retryTimeout?

> `optional` **retryTimeout**: `number`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L38)

***

### tx

> **tx**: `Pick`\<`Transaction`\<[`TransactionTracker`](../enumerations/TransactionTracker.md)\>, `"chainId"` \| `"txKey"`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:30](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L30)

***

### waitForTransactionReceiptParams?

> `optional` **waitForTransactionReceiptParams**: `WaitForTransactionReceiptParameters`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:39](https://github.com/TuwaIO/pulsar-core/blob/ff59e866e33c339d5aa0ce3a95095cd1c8e289d9/packages/pulsar-evm/src/trackers/evmTracker.ts#L39)
