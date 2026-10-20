# safePollingInterval()

> **safePollingInterval**(`elapsedMs`): `number`

Defined in: [trackers/safeTracker.ts:63](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/trackers/safeTracker.ts#L63)

The polling schedule of the Safe tracker: every 5 s during the first hour of tracking, then every 30 s, since
collecting the signatures of several owners can take days.

## Parameters

### elapsedMs

`number`

Milliseconds since tracking started.

## Returns

`number`

The delay before the next check, in milliseconds.
