[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/utils/checkAndInitializeTrackerInStore.ts:35](https://github.com/TuwaIO/pulsar-core/blob/5415e11372c5ba1e590020a446666e4f0bb4d82d/packages/pulsar-evm/src/utils/checkAndInitializeTrackerInStore.ts#L35)

Initializes the appropriate tracker for a given transaction based on its `tracker` type.
This function acts as a central router, delegating to the specific tracker implementation
(e.g., standard EVM, Gelato, or Safe).

## Type Parameters

### T

`T` *extends* `Transaction`

The application-specific transaction type, extending the base `Transaction`.

## Parameters

### params

`InitializeTrackerParams`\<`T`\>

The parameters for initializing the tracker.

## Returns

`Promise`\<`void`\>

A promise that resolves once the tracking process has been successfully initiated.
