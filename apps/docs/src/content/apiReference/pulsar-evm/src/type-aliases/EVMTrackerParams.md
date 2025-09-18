[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# EVMTrackerParams

> **EVMTrackerParams** = `object`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:28](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L28)

Defines the parameters for the low-level EVM transaction tracker.

## Properties

### chains

> **chains**: `Chain`[]

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:30](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L30)

***

### onFailure()

> **onFailure**: (`error?`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:34](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L34)

#### Parameters

##### error?

`unknown`

#### Returns

`void`

***

### onInitialize()?

> `optional` **onInitialize**: () => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:35](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L35)

#### Returns

`void`

***

### onReplaced()

> **onReplaced**: (`replacement`) => `void`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:33](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L33)

#### Parameters

##### replacement

`ReplacementReturnType`

#### Returns

`void`

***

### onSuccess()

> **onSuccess**: (`txDetails`, `receipt`, `client`) => `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:32](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L32)

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

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:31](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L31)

#### Parameters

##### txDetails

`GetTransactionReturnType`

#### Returns

`void`

***

### retryCount?

> `optional` **retryCount**: `number`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:36](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L36)

***

### retryTimeout?

> `optional` **retryTimeout**: `number`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:37](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L37)

***

### tx

> **tx**: `Pick`\<`Transaction`, `"chainId"` \| `"txKey"`\>

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:29](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L29)

***

### waitForTransactionReceiptParams?

> `optional` **waitForTransactionReceiptParams**: `WaitForTransactionReceiptParameters`

Defined in: [packages/pulsar-evm/src/trackers/evmTracker.ts:38](https://github.com/TuwaIO/pulsar-core/blob/2c6f93125183d258e3ab6bfaceb7a8c25afd5e6b/packages/pulsar-evm/src/trackers/evmTracker.ts#L38)
