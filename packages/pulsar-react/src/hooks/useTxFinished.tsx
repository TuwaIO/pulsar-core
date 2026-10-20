/**
 * @file React hook that runs a callback whenever the Pulsar store marks a transaction as finished.
 */

import { useEffect, useEffectEvent } from 'react';

/**
 * The parameters of {@link useTxFinished}.
 *
 * @template T - The application transaction type.
 */
export type UseTxFinishedParams<T> = {
  /**
   * The store's `subscribeTxFinished` action (`createPulsarStore` from `@tuwaio/pulsar-core`). Pass a stable reference:
   * the hook subscribes again whenever it changes.
   */
  subscribeTxFinished: (listener: (tx: T) => Promise<void> | void) => () => void;
  /**
   * Called with the transaction when it reaches `Success`, `Failed` or `Replaced`, also when a tracker restarted after
   * a page reload finishes it. The latest function is used, so an inline callback does not subscribe again. Its return
   * value is not awaited; a rejection is logged by the store.
   *
   * @param tx - The transaction with its final `status`.
   */
  onFinished: (tx: T) => Promise<void> | void;
};

/**
 * Subscribes to the "transaction finished" event of a Pulsar store while the component is mounted (see
 * `TxFinishedListener` of `@tuwaio/pulsar-core`). Use it for reactions that need the component's state and must also
 * run for transactions restored after a page reload, which lost the `onSuccess` of `executeTxAction`: refetching
 * balances or list data, for example.
 *
 * Side effects: adds a listener to the store in an effect and removes it on unmount or when `subscribeTxFinished`
 * changes. Events that arrive after the cleanup are ignored.
 *
 * @template T - The application transaction type.
 * @param params - The hook parameters.
 * @param params.subscribeTxFinished - The store's `subscribeTxFinished` action.
 * @param params.onFinished - Called with each finished transaction.
 *
 * @example
 * ```tsx
 * import { TransactionStatus } from '@tuwaio/pulsar-core';
 * import { useTxFinished } from '@tuwaio/pulsar-react';
 *
 * import { usePulsarStore } from './pulsarStore';
 *
 * export function BalancesRefresher({ refetch }: { refetch: () => void }) {
 *   const subscribeTxFinished = usePulsarStore((state) => state.subscribeTxFinished);
 *
 *   useTxFinished({
 *     subscribeTxFinished,
 *     onFinished: (tx) => {
 *       if (tx.status === TransactionStatus.Success) refetch();
 *     },
 *   });
 *
 *   return null;
 * }
 * ```
 */
export const useTxFinished = <T,>({ subscribeTxFinished, onFinished }: UseTxFinishedParams<T>) => {
  // Reads the latest `onFinished` without being an effect dependency, so an inline callback does not resubscribe
  const handleFinished = useEffectEvent((tx: T) => onFinished(tx));

  useEffect(() => {
    let isActive = true;

    const unsubscribe = subscribeTxFinished((tx) => {
      if (!isActive) return;
      return handleFinished(tx);
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [subscribeTxFinished]);
};
