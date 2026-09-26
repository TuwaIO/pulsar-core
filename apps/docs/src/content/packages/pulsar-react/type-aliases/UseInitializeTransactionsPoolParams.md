# UseInitializeTransactionsPoolParams

> **UseInitializeTransactionsPoolParams** = `object`

Defined in: [useInitializeTransactionsPool.tsx:10](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L10)

The parameters of [useInitializeTransactionsPool](/packages/pulsar-react/functions/useInitializeTransactionsPool.md).

## Properties

### initializeTransactionsPool

> **initializeTransactionsPool**: () => `Promise`\<`void`\>

Defined in: [useInitializeTransactionsPool.tsx:15](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L15)

The store's `initializeTransactionsPool` action (`createPulsarStore` from `@tuwaio/pulsar-core`). Pass a stable
reference: the hook runs it again whenever it changes.

#### Returns

`Promise`\<`void`\>

***

### onError?

> `optional` **onError?**: (`error`) => `void`

Defined in: [useInitializeTransactionsPool.tsx:23](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L23)

Called when `initializeTransactionsPool` rejects. The latest function is used, so an inline callback does not run
the initialization again.

#### Parameters

##### error

`Error`

The rejection reason of `initializeTransactionsPool`.

#### Returns

`void`

#### Default Value

Logs the error with `console.error`.
