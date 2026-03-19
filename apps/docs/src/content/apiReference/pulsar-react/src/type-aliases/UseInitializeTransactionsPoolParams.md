[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# UseInitializeTransactionsPoolParams

> **UseInitializeTransactionsPoolParams** = `object`

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:12](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L12)

Configuration for [useInitializeTransactionsPool](../functions/useInitializeTransactionsPool.md).

## Properties

### initializeTransactionsPool()

> **initializeTransactionsPool**: () => `Promise`\<`void`\>

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:16](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L16)

Re-initializes background trackers for all pending transactions stored in the Pulsar store.

#### Returns

`Promise`\<`void`\>

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:22](https://github.com/TuwaIO/pulsar-core/blob/af611573e4695e0c821dd37abe309706e04c12a6/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L22)

Optional error handler called when initialization or the optional initial fetch fails.

#### Parameters

##### error

`Error`

#### Returns

`void`

#### Default Value

`console.error`
