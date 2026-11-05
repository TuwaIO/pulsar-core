# SafeTrackerOptions

> **SafeTrackerOptions** = `object`

Defined in: [trackers/safeTracker.ts:96](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L96)

The options of the Safe tracker.

## Properties

### notFoundGraceMs?

> `optional` **notFoundGraceMs?**: `number`

Defined in: [trackers/safeTracker.ts:109](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L109)

How long the service may answer 404 for a transaction, in milliseconds from the first such answer, before it counts
as a final failure; until then a 404 is a failed attempt. Defaults to 0, final at once, and to 10 minutes in
[safeTrackerForStore](/packages/pulsar-evm/functions/safeTrackerForStore.md), as a new proposal is indexed with a delay.

***

### pendingTimeoutMs?

> `optional` **pendingTimeoutMs?**: `number` \| `null`

Defined in: [trackers/safeTracker.ts:103](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L103)

How long a transaction may stay unexecuted, counted from when it was proposed (`submissionDate`), before the
tracker marks it `Failed`. `null` keeps tracking it for as long as the page is open. [createSafeFetcher](/packages/pulsar-evm/functions/createSafeFetcher.md)
defaults to one day ([SAFE\_DEFAULT\_PENDING\_TIMEOUT\_MS](/packages/pulsar-evm/variables/SAFE_DEFAULT_PENDING_TIMEOUT_MS.md)) and [safeTrackerForStore](/packages/pulsar-evm/functions/safeTrackerForStore.md) to `null`, as collecting
the signatures of several owners can take days.
