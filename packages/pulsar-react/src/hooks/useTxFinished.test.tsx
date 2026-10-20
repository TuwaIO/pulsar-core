/**
 * @file Unit tests for the useTxFinished hook.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';

let effectCallback: (() => (() => void) | void) | undefined;
let effectDeps: unknown[] | undefined;

vi.mock('react', async (importActual) => {
  const actual = await importActual<typeof import('react')>();
  return {
    ...actual,
    useEffect: vi.fn((cb: () => (() => void) | void, deps?: unknown[]) => {
      effectCallback = cb;
      effectDeps = deps;
    }),
    // Outside a React render the effect event is the callback itself.
    useEffectEvent: vi.fn(<T,>(callback: T) => callback),
  };
});

import { useTxFinished } from './useTxFinished';

type Tx = { txKey: string; status: string };

function createSubscription() {
  let listener: ((tx: Tx) => Promise<void> | void) | undefined;
  const unsubscribe = vi.fn();
  const subscribeTxFinished = vi.fn((nextListener: (tx: Tx) => Promise<void> | void) => {
    listener = nextListener;
    return unsubscribe;
  });
  return { subscribeTxFinished, unsubscribe, emit: (tx: Tx) => listener?.(tx) };
}

describe('useTxFinished', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    effectCallback = undefined;
    effectDeps = undefined;
  });

  test('subscribes in an effect and passes finished transactions to onFinished', () => {
    const { subscribeTxFinished, emit } = createSubscription();
    const onFinished = vi.fn();
    useTxFinished({ subscribeTxFinished, onFinished });

    expect(subscribeTxFinished).not.toHaveBeenCalled();
    effectCallback!();
    expect(subscribeTxFinished).toHaveBeenCalledTimes(1);

    const tx = { txKey: '0x1', status: 'Success' };
    emit(tx);
    expect(onFinished).toHaveBeenCalledWith(tx);
  });

  test('lists only subscribeTxFinished as an effect dependency', () => {
    const { subscribeTxFinished } = createSubscription();
    useTxFinished({ subscribeTxFinished, onFinished: () => undefined });

    // An inline `onFinished` changes on every render; it must not subscribe again.
    expect(effectDeps).toEqual([subscribeTxFinished]);
  });

  test('unsubscribes on cleanup and ignores events that arrive after it', () => {
    const { subscribeTxFinished, unsubscribe, emit } = createSubscription();
    const onFinished = vi.fn();
    useTxFinished({ subscribeTxFinished, onFinished });

    const cleanup = effectCallback!() as () => void;
    cleanup();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    emit({ txKey: '0x1', status: 'Success' });
    expect(onFinished).not.toHaveBeenCalled();
  });
});
