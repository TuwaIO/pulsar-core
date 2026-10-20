# useTxFinished()

> **useTxFinished**\<`T`\>(`params`): `void`

Defined in: [useTxFinished.tsx:63](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/src/hooks/useTxFinished.tsx#L63)

Subscribes to the "transaction finished" event of a Pulsar store while the component is mounted (see
`TxFinishedListener` of `@tuwaio/pulsar-core`). Use it for reactions that need the component's state and must also
run for transactions restored after a page reload, which lost the `onSuccess` of `executeTxAction`: refetching
balances or list data, for example.

Side effects: adds a listener to the store in an effect and removes it on unmount or when `subscribeTxFinished`
changes. Events that arrive after the cleanup are ignored.

## Type Parameters

### T

`T`

The application transaction type.

## Parameters

### params

[`UseTxFinishedParams`](/packages/pulsar-react/type-aliases/UseTxFinishedParams.md)\<`T`\>

The hook parameters.

## Returns

`void`

## Example

```tsx
import { TransactionStatus } from '@tuwaio/pulsar-core';
import { useTxFinished } from '@tuwaio/pulsar-react';

import { usePulsarStore } from './pulsarStore';

export function BalancesRefresher({ refetch }: { refetch: () => void }) {
  const subscribeTxFinished = usePulsarStore((state) => state.subscribeTxFinished);

  useTxFinished({
    subscribeTxFinished,
    onFinished: (tx) => {
      if (tx.status === TransactionStatus.Success) refetch();
    },
  });

  return null;
}
```
