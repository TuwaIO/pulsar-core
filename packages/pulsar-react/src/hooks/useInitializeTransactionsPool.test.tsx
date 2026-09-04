/**
 * @file Unit tests for useInitializeTransactionsPool hook.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';

let effectCallback: (() => (() => void) | void) | undefined;

vi.mock('react', async (importActual) => {
  const actual = await importActual<typeof import('react')>();
  return {
    ...actual,
    useEffect: vi.fn((cb: () => (() => void) | void) => {
      effectCallback = cb;
    }),
  };
});

import { useInitializeTransactionsPool } from './useInitializeTransactionsPool';

describe('useInitializeTransactionsPool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    effectCallback = undefined;
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
