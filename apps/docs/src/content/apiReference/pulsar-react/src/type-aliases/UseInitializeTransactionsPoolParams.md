[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# UseInitializeTransactionsPoolParams

> **UseInitializeTransactionsPoolParams** = `object`

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:12](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L12)

Configuration for [useInitializeTransactionsPool](../functions/useInitializeTransactionsPool.md).

## Properties

### initialFetchFromDB()?

> `optional` **initialFetchFromDB**: () => `Promise`\<`void`\>

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:28](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L28)

Optional callback that performs the initial history fetch from the remote data source.
This is useful when the in-memory store should be populated immediately after tracker
restoration.

#### Returns

`Promise`\<`void`\>

***

### initializeTransactionsPool()

> **initializeTransactionsPool**: () => `Promise`\<`void`\>

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:16](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L16)

Re-initializes background trackers for all pending transactions stored in the Pulsar store.

#### Returns

`Promise`\<`void`\>

***

### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:22](https://github.com/TuwaIO/pulsar-core/blob/409d179eb7db474173c52a361610758253656cc7/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L22)

Optional error handler called when initialization or the optional initial fetch fails.

#### Parameters

##### error

`Error`

#### Returns

`void`

#### Default Value

`console.error`
