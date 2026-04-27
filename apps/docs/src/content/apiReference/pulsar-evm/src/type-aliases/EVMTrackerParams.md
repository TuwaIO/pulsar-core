[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# EVMTrackerParams

> **EVMTrackerParams** = `object`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:30](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L30)

Defines the parameters for the low-level EVM transaction tracker.

## Properties

### config

> **config**: `Config`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:32](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L32)

***

### onConfirmationsUpdate?

> `optional` **onConfirmationsUpdate?**: (`confirmations`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:40](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L40)

#### Parameters

##### confirmations

`number`

#### Returns

`void`

***

### onFailure

> **onFailure**: (`error?`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L36)

#### Parameters

##### error?

`unknown`

#### Returns

`void`

***

### onInitialize?

> `optional` **onInitialize?**: () => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L37)

#### Returns

`void`

***

### onReplaced

> **onReplaced**: (`replacement`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L35)

#### Parameters

##### replacement

`ReplacementReturnType`

#### Returns

`void`

***

### onSuccess

> **onSuccess**: (`txDetails`, `receipt`, `client`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L34)

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

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L33)

#### Parameters

##### txDetails

`GetTransactionReturnType`

#### Returns

`void`

***

### retryCount?

> `optional` **retryCount?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L38)

***

### retryTimeout?

> `optional` **retryTimeout?**: `number`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:39](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L39)

***

### tx

> **tx**: `Pick`\<`Transaction`, `"chainId"` \| `"txKey"` \| `"requiredConfirmations"`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:31](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L31)

***

### waitForTransactionReceiptParams?

> `optional` **waitForTransactionReceiptParams?**: `WaitForTransactionReceiptParameters`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:41](https://github.com/TuwaIO/pulsar-core/blob/ce24fbe39596f795b7bbc096cc203e1d075c5618/packages/pulsar-evm/src/trackers/evmTracker.ts#L41)
