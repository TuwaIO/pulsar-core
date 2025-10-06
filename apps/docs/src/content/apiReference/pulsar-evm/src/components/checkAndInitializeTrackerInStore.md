[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# checkAndInitializeTrackerInStore()

> **checkAndInitializeTrackerInStore**\<`T`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/pulsar-evm/src/utils/checkAndInitializeTrackerInStore.ts:35](https://github.com/TuwaIO/pulsar-core/blob/bdceb94ce44190f4d3014c2e4cf435b68c70b5b1/packages/pulsar-evm/src/utils/checkAndInitializeTrackerInStore.ts#L35)

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
