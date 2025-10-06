[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# useInitializeTransactionsPool()

> **useInitializeTransactionsPool**(`params`): `void`

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:36](https://github.com/TuwaIO/pulsar-core/blob/a14a0910e81ded47cebdc68cb85e5e000bc20e3a/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L36)

A React hook that triggers the initialization of the transaction pool when the component mounts.

This should be used once in your application's layout or root component. It ensures that any
pending transactions from a previous session (stored in `localStorage`) are picked up and

their trackers are re-activated.

## Parameters

### params

The parameters for the hook.

#### initializeTransactionsPool

() => `Promise`\<`void`\>

The `initializeTransactionsPool` function from your Pulsar store instance.

#### onError?

(`error`) => `void`

An optional custom function to handle any errors that occur during initialization. Defaults to `console.error`.

## Returns

`void`

## Example

```tsx
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { pulsarStore } from './path/to/your/store';

function AppLayout({ children }) {
// This hook will run once when the layout mounts.
useInitializeTransactionsPool({
initializeTransactionsPool: pulsarStore.getState().initializeTransactionsPool,
onError: (err) => console.warn('Failed to re-initialize trackers:', err),
});

return <div>{children}</div>;
}
```
