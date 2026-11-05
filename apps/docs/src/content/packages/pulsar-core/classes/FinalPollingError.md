# FinalPollingError

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:117](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L117)

Thrown by a fetcher when no later check can change the answer, such as a chain the service does not cover: the tracker
calls `onFailure()` and stops at once, also with `retryForeverEveryMs`. Any other error counts as a failed attempt.

## Extends

- `Error`

## Constructors

### Constructor

> **new FinalPollingError**(`message?`): `FinalPollingError`

Defined in: node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1080

#### Parameters

##### message?

`string`

#### Returns

`FinalPollingError`

#### Inherited from

`Error.constructor`

### Constructor

> **new FinalPollingError**(`message?`, `options?`): `FinalPollingError`

Defined in: node\_modules/.pnpm/typescript@6.0.3/node\_modules/typescript/lib/lib.es5.d.ts:1080

#### Parameters

##### message?

`string`

##### options?

`ErrorOptions`

#### Returns

`FinalPollingError`

#### Inherited from

`Error.constructor`

## Properties

### name

> **name**: `string` = `'FinalPollingError'`

Defined in: [packages/pulsar-core/src/utils/initializePollingTracker.ts:118](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/src/utils/initializePollingTracker.ts#L118)

#### Overrides

`Error.name`
