import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { initializePollingTracker } from './initializePollingTracker';

describe('initializePollingTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('accepts a minimal transaction with only txKey and pending', async () => {
    const fetcher = vi.fn(async ({ stopPolling, onSuccess }) => {
      onSuccess('done');
      stopPolling({ withoutRemoving: true });
    });
    const onSuccess = vi.fn();

    initializePollingTracker<string, { txKey: string; pending: boolean }>({
      tx: { txKey: 'task-1', pending: true },
      fetcher,
      onSuccess,
      onFailure: vi.fn(),
      pollingInterval: 10,
    });

    await vi.advanceTimersByTimeAsync(10);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith('done');
  });

  it('counts only consecutive failed fetches towards maxRetries', async () => {
    let call = 0;
    // Fails twice, succeeds once, fails twice, succeeds once... never three failures in a row.
    const fetcher = vi.fn(async () => {
      call += 1;
      if (call % 3 !== 0) throw new Error('RPC glitch');
    });
    const onFailure = vi.fn();
    const removeTxFromPool = vi.fn();

    initializePollingTracker({
      tx: { txKey: 'task-2', pending: true },
      fetcher,
      onSuccess: vi.fn(),
      onFailure,
      removeTxFromPool,
      pollingInterval: 10,
      maxRetries: 3,
    });

    await vi.advanceTimersByTimeAsync(10 * 12);

    expect(fetcher).toHaveBeenCalledTimes(12);
    expect(onFailure).not.toHaveBeenCalled();
    expect(removeTxFromPool).not.toHaveBeenCalled();
  });

  it('fails, stops and removes the transaction after maxRetries consecutive errors', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('RPC down');
    });
    const onFailure = vi.fn();
    const removeTxFromPool = vi.fn();

    initializePollingTracker({
      tx: { txKey: 'task-3', pending: true },
      fetcher,
      onSuccess: vi.fn(),
      onFailure,
      removeTxFromPool,
      pollingInterval: 10,
      maxRetries: 3,
    });

    await vi.advanceTimersByTimeAsync(10 * 5);

    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(onFailure).toHaveBeenCalledTimes(1);
    expect(onFailure).toHaveBeenCalledWith();
    expect(removeTxFromPool).toHaveBeenCalledWith('task-3');
  });

  it('does nothing for a transaction that is no longer pending', async () => {
    const fetcher = vi.fn();
    const onInitialize = vi.fn();

    initializePollingTracker({
      tx: { txKey: 'task-4', pending: false },
      fetcher,
      onInitialize,
      onSuccess: vi.fn(),
      onFailure: vi.fn(),
      pollingInterval: 10,
    });

    await vi.advanceTimersByTimeAsync(50);

    expect(onInitialize).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });
});
