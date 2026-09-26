/**
 * @file Unit tests for useInitializeTransactionsPool hook.
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

import { useInitializeTransactionsPool } from './useInitializeTransactionsPool';

describe('useInitializeTransactionsPool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    effectCallback = undefined;
    effectDeps = undefined;
  });

  test('does not list onError as an effect dependency', () => {
    const mockInit = vi.fn().mockResolvedValue(undefined);
    useInitializeTransactionsPool({ initializeTransactionsPool: mockInit, onError: () => undefined });

    // An inline `onError` changes on every render; it must not re-run the initialization.
    expect(effectDeps).toEqual([mockInit]);
  });

  test('logs to console.error when no onError is provided', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const testError = new Error('Rehydration failed');
    useInitializeTransactionsPool({ initializeTransactionsPool: vi.fn().mockRejectedValue(testError) });

    effectCallback!();

    await vi.waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('[Pulsar] Failed to initialize transactions pool:', testError);
    });
    consoleError.mockRestore();
  });

  test('registers useEffect with initialization logic and handles success', async () => {
    const mockInit = vi.fn().mockResolvedValue(undefined);
    useInitializeTransactionsPool({ initializeTransactionsPool: mockInit });

    expect(effectCallback).toBeDefined();
    const cleanup = effectCallback!();
    expect(mockInit).toHaveBeenCalledTimes(1);

    if (typeof cleanup === 'function') {
      cleanup();
    }
  });

  test('invokes onError when initializeTransactionsPool rejects', async () => {
    const testError = new Error('Rehydration failed');
    const mockInit = vi.fn().mockRejectedValue(testError);
    const mockOnError = vi.fn();

    useInitializeTransactionsPool({
      initializeTransactionsPool: mockInit,
      onError: mockOnError,
    });

    expect(effectCallback).toBeDefined();
    effectCallback!();

    await vi.waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(testError);
    });
  });

  test('does not invoke onError if cleaned up before rejection', async () => {
    let rejectPromise!: (err: unknown) => void;
    const pendingPromise = new Promise<void>((_, reject) => {
      rejectPromise = reject;
    });

    const mockInit = vi.fn().mockReturnValue(pendingPromise);
    const mockOnError = vi.fn();

    useInitializeTransactionsPool({
      initializeTransactionsPool: mockInit,
      onError: mockOnError,
    });

    expect(effectCallback).toBeDefined();
    const cleanup = effectCallback!() as () => void;
    cleanup(); // Unmount/cleanup before rejection

    rejectPromise(new Error('Late error'));

    // Microtask flush
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(mockOnError).not.toHaveBeenCalled();
  });
});
