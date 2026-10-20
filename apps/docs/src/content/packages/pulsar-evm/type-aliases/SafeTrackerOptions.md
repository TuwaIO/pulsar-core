# SafeTrackerOptions

> **SafeTrackerOptions** = `object`

Defined in: [trackers/safeTracker.ts:89](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L89)

The options of the Safe tracker.

## Properties

### pendingTimeoutMs?

> `optional` **pendingTimeoutMs?**: `number` \| `null`

Defined in: [trackers/safeTracker.ts:95](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L95)

How long a transaction may stay unexecuted, counted from when it was proposed (`submissionDate`), before the
tracker marks it `Failed`. `null` keeps tracking it for as long as the page is open. Defaults to one day
([SAFE\_DEFAULT\_PENDING\_TIMEOUT\_MS](/packages/pulsar-evm/variables/SAFE_DEFAULT_PENDING_TIMEOUT_MS.md)).
