# createAbandonCheck()

> **createAbandonCheck**(`isTxTracked`, `txKey`): (() => `boolean`) \| `undefined`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:129](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L129)

The stop check of a store tracker: `true` once the store stopped tracking a transaction it was tracking. A tracker
started by hand on a transaction the store never tracked (`isTxTracked` says no from the start) goes on as before.

## Parameters

### isTxTracked

((`txKey`) => `boolean`) \| `undefined`

`isTxTracked` of the store, when the tracker has it.

### txKey

`string`

The key of the transaction.

## Returns

(() => `boolean`) \| `undefined`

The function to pass as `isAbandoned`, or `undefined` when there is nothing to check.
