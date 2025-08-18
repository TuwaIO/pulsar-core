[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# useInitializeTransactionsPool()

> **useInitializeTransactionsPool**(`initializeTransactionsPool`, `customErrorHandler?`): `void`

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:34](https://github.com/TuwaIO/pulsar-core/blob/7c2e2a786e9ff1aa314c1f872c1e0a91d1d129b1/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L34)

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
