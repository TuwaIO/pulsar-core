# useInitializeTransactionsPool()

> **useInitializeTransactionsPool**(`params`): `void`

Defined in: [useInitializeTransactionsPool.tsx:56](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/src/hooks/useInitializeTransactionsPool.tsx#L56)

Calls `initializeTransactionsPool` in an effect after the component mounts, so the trackers of transactions that
were pending before a page reload start again. It runs on the client only, after the store has restored its state
from `localStorage`.

Use it once, in a component that stays mounted (a root layout or provider): every run starts new trackers. The
effect runs again only when `initializeTransactionsPool` changes. In development, React Strict Mode runs effects
twice, so pending transactions get two trackers there.

## Parameters

### params

[`UseInitializeTransactionsPoolParams`](/packages/pulsar-react/type-aliases/UseInitializeTransactionsPoolParams.md)

The hook parameters.

## Returns

`void`

## Example

```tsx
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';

import { pulsarStore } from './pulsarStore';

export function PulsarInitializer() {
  useInitializeTransactionsPool({
    initializeTransactionsPool: pulsarStore.getState().initializeTransactionsPool,
    onError: (error) => console.warn('Failed to restore transactions:', error),
  });

  return null;
}
```
