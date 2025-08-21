[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# useInitializeTransactionsPool()

> **useInitializeTransactionsPool**(`initializeTransactionsPool`, `customErrorHandler?`): `void`

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:34](https://github.com/TuwaIO/pulsar-core/blob/ea066c8cd65e6c1227300bf48fc7dcb6a33a8ab8/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L34)

A React hook that triggers the initialization of the transaction pool when the component mounts.
This ensures that any pending transactions from a previous session are picked up and tracked again.

## Parameters

### initializeTransactionsPool

() => `Promise`\<`void`\>

The `initializeTransactionsPool` function from the Zustand store.

### customErrorHandler?

(`error`) => `void`

An optional custom function to handle errors during initialization. Defaults to console.error.

## Returns

`void`
