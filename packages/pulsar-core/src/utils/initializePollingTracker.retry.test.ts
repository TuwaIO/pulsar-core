/**
 * @file The polling tracker when a check cannot be made: not being able to ask says nothing about the transaction.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { initializePollingTracker } from './initializePollingTracker';

describe('initializePollingTracker with retryForeverEveryMs', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const tx = { txKey: '0x1', pending: true };

  it('keeps asking, more slowly, after maxRetries failed checks and never reports a failure', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('RPC is down'));
    const onFailure = vi.fn();
    initializePollingTracker({
      tx,
      fetcher,
      onSuccess: vi.fn(),
      onFailure,
      pollingInterval: 1000,
      maxRetries: 3,
      retryForeverEveryMs: 60_000,
    });

    await vi.advanceTimersByTimeAsync(3000);
    expect(fetcher).toHaveBeenCalledTimes(3);

    await vi.advanceTimersByTimeAsync(59_000);
    expect(fetcher).toHaveBeenCalledTimes(3);

    await vi.advanceTimersByTimeAsync(1000);
    expect(fetcher).toHaveBeenCalledTimes(4);
    expect(onFailure).not.toHaveBeenCalled();
  });

  it('goes back to the normal pace once a check succeeds, and a final answer still ends it', async () => {
    const onSuccess = vi.fn();
    let answer = false;
    const fetcher = vi.fn(async ({ stopPolling, onSuccess: done }) => {
      if (!answer) throw new Error('RPC is down');
      done('ok');
      stopPolling({ withoutRemoving: true });
    });
    initializePollingTracker<string, typeof tx>({
      tx,
      fetcher,
      onSuccess,
      onFailure: vi.fn(),
      pollingInterval: 1000,
      maxRetries: 1,
      retryForeverEveryMs: 60_000,
    });

    await vi.advanceTimersByTimeAsync(1000);
    answer = true;
    await vi.advanceTimersByTimeAsync(60_000);

    expect(onSuccess).toHaveBeenCalledWith('ok');
    const calls = fetcher.mock.calls.length;
    await vi.advanceTimersByTimeAsync(120_000);
    expect(fetcher.mock.calls.length).toBe(calls);
  });

  it('without the option it still gives up: servers and standalone use count on that', async () => {
    const onFailure = vi.fn();
    initializePollingTracker({
      tx,
      fetcher: vi.fn().mockRejectedValue(new Error('RPC is down')),
      onSuccess: vi.fn(),
      onFailure,
      pollingInterval: 1000,
      maxRetries: 3,
    });

    await vi.advanceTimersByTimeAsync(3000);

    expect(onFailure).toHaveBeenCalledOnce();
  });
});
