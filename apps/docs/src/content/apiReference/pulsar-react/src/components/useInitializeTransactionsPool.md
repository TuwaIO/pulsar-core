[**@tuwaio/pulsar-core-monorepo**](../../../README.md)

***

# useInitializeTransactionsPool()

> **useInitializeTransactionsPool**(`params`): `void`

Defined in: [packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx:50](https://github.com/TuwaIO/pulsar-core/blob/f7116b96322133914fc40c97a545da2d7493aa4f/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L50)

Re-initializes pending transaction trackers when the component mounts.

Use this hook once in your application's root layout or top-level provider.
It restores tracker activity after reloads and can optionally fetch the initial
remote transaction history right after restoration.

## Parameters

### params

[`UseInitializeTransactionsPoolParams`](../type-aliases/UseInitializeTransactionsPoolParams.md)

Hook configuration.

## Returns

`void`

## Example

```tsx
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';

function AppLayout() {
  useInitializeTransactionsPool({
    initializeTransactionsPool: store.getState().initializeTransactionsPool,
    onError: (error) => console.warn('Failed to restore transactions:', error),
  });

  return <div>...</div>;
}
```
