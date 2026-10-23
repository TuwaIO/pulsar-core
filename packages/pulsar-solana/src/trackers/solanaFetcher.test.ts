/**
 * @file Unit tests for `solanaFetcher`: RPC errors, unknown signatures, transaction details and terminal statuses.
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import dayjs from 'dayjs';
import { beforeEach, describe, expect, onTestFinished, test, vi } from 'vitest';

import { rememberSolanaTxLifetime } from '../utils/solanaTxLifetimes';
import { solanaFetcher, SolanaFetcherTx } from './solanaTracker';

const getSignatureStatuses = vi.fn();
const getTransaction = vi.fn();
const getBlockHeight = vi.fn();

vi.mock('@tuwaio/orbit-solana', async (importActual) => {
  const original = await importActual<typeof import('@tuwaio/orbit-solana')>();
  return {
    ...original,
    createSolanaRPC: vi.fn(() => ({
      getSignatureStatuses: (...args: unknown[]) => ({ send: () => getSignatureStatuses(...args) }),
      getTransaction: (...args: unknown[]) => ({ send: () => getTransaction(...args) }),
      getBlockHeight: (...args: unknown[]) => ({ send: () => getBlockHeight(...args) }),
    })),
  };
});

function createTx(overrides: Partial<SolanaFetcherTx> = {}): SolanaFetcherTx {
  return {
    adapter: OrbitAdapter.SOLANA,
    txKey: 'signature',
    chainId: 'solana:devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    localTimestamp: dayjs().unix(),
    ...overrides,
  };
}

function createCallbacks() {
  return {
    stopPolling: vi.fn(),
    onSuccess: vi.fn(),
    onFailure: vi.fn(),
    onIntervalTick: vi.fn(),
  };
}

const txDetails = {
  meta: { fee: 5000n },
  transaction: { message: { recentBlockhash: 'blockhash', instructions: [] } },
};

/** A mainnet version 1 transaction as `getTransaction` returns it (`json` encoding, shortened logs and balances). */
const version1TxDetails = {
  blockTime: 1792741913n,
  slot: 460364569n,
  version: 1,
  meta: {
    computeUnitsConsumed: 528n,
    costUnits: 2838n,
    err: null,
    fee: 5540n,
    innerInstructions: [],
    loadedAddresses: { readonly: [], writable: [] },
    logMessages: ['Program HBVw6bZtcCaezhcBrmfyXBSBRWCdv72271xQ4GPvms2z invoke [1]'],
    postBalances: [9120715494n],
    postTokenBalances: [],
    preBalances: [9120721034n],
    preTokenBalances: [],
    rewards: [],
    status: { Ok: null },
  },
  transaction: {
    message: {
      accountKeys: ['9sdtCBadNXG18oh51wKKctvYzamCZA4PqippXzV4wmz', 'HBVw6bZtcCaezhcBrmfyXBSBRWCdv72271xQ4GPvms2z'],
      header: { numReadonlySignedAccounts: 0, numReadonlyUnsignedAccounts: 2, numRequiredSignatures: 1 },
      instructions: [
        {
          accounts: [0, 1, 5],
          data: '116hRzQ7cRgWccY5YmyAqSEzuBCgQj9g8WLUz5XKpYyyxT',
          programIdIndex: 6,
          stackHeight: 1,
        },
      ],
      recentBlockhash: 'C24UcwfULj7vCCsM6siPhs3ELFmHpEvPxUpU4kGjNnQz',
      transactionConfig: {
        computeUnitLimit: 540,
        heapSize: null,
        loadedAccountsDataSizeLimit: 262144,
        priorityFee: 540n,
      },
    },
    signatures: ['4LTZqMCNdV9vVboj9gakM99Md3fLfrvtmt2W7CxqmB3ok8bX5zVETfXTTRCdxeomBGuie9WTsCfHJrZCU9JLNN7b'],
  },
};

/** Answers like a mainnet RPC for a version 1 transaction: lower `maxSupportedTransactionVersion` values are refused. */
function getVersion1Transaction(_signature: string, config: { maxSupportedTransactionVersion?: number }) {
  if ((config.maxSupportedTransactionVersion ?? -1) < 1) {
    return Promise.reject(new Error('Transaction version (1) is not supported by the requesting client.'));
  }
  return Promise.resolve(version1TxDetails);
}

const unsupportedVersionError = new Error('Transaction version (2) is not supported by the requesting client.');

describe('solanaFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('rethrows RPC errors so the polling tracker can retry instead of failing the transaction', async () => {
    getSignatureStatuses.mockRejectedValue(new Error('fetch failed'));
    const callbacks = createCallbacks();

    await expect(solanaFetcher({ tx: createTx(), ...callbacks })).rejects.toThrow('fetch failed');

    expect(callbacks.onFailure).not.toHaveBeenCalled();
    expect(callbacks.stopPolling).not.toHaveBeenCalled();
  });

  test('searches the transaction history so resumed transactions are found', async () => {
    getSignatureStatuses.mockResolvedValue({ value: [null] });

    await solanaFetcher({ tx: createTx(), ...createCallbacks() });

    expect(getSignatureStatuses).toHaveBeenCalledWith(['signature'], { searchTransactionHistory: true });
  });

  test('keeps polling an unknown signature that is less than an hour old', async () => {
    getSignatureStatuses.mockResolvedValue({ value: [null] });
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onFailure).not.toHaveBeenCalled();
    expect(callbacks.stopPolling).not.toHaveBeenCalled();
  });

  test('fails and stops an unknown signature after an hour, keeping the transaction', async () => {
    getSignatureStatuses.mockResolvedValue({ value: [null] });
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx({ localTimestamp: dayjs().subtract(2, 'hour').unix() }), ...callbacks });

    expect(callbacks.onFailure).toHaveBeenCalledWith();
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('fetches the transaction details only once per tracked transaction', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: 1n, err: null, confirmationStatus: 'confirmed' }],
    });
    getTransaction.mockResolvedValue(txDetails);
    const tx = createTx();
    const callbacks = createCallbacks();

    await solanaFetcher({ tx, ...callbacks });
    await solanaFetcher({ tx, ...callbacks });
    await solanaFetcher({ tx, ...callbacks });

    expect(getSignatureStatuses).toHaveBeenCalledTimes(3);
    expect(getTransaction).toHaveBeenCalledTimes(1);
    expect(callbacks.onIntervalTick).toHaveBeenLastCalledWith(
      expect.objectContaining({ fee: 5000, recentBlockhash: 'blockhash', instructions: [] }),
    );
  });

  test('does not fetch the details when the transaction already has them', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: null, err: null, confirmationStatus: 'finalized' }],
    });
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx({ fee: 5000, recentBlockhash: 'blockhash', instructions: [] }), ...callbacks });

    expect(getTransaction).not.toHaveBeenCalled();
    expect(callbacks.onSuccess).toHaveBeenCalledTimes(1);
  });

  test('reports success for a finalized transaction', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: null, err: null, confirmationStatus: 'finalized' }],
    });
    getTransaction.mockResolvedValue(txDetails);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ slot: 10, confirmations: 0, fee: 5000, recentBlockhash: 'blockhash' }),
    );
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('reports failure for a transaction with an on-chain error', async () => {
    const err = { InstructionError: [0, { Custom: 1 }] };
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: 1n, err, confirmationStatus: 'confirmed' }],
    });
    getTransaction.mockResolvedValue(txDetails);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onFailure).toHaveBeenCalledWith(expect.objectContaining({ err }));
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('throws for a transaction that is not a Solana transaction', async () => {
    await expect(solanaFetcher({ tx: createTx({ adapter: OrbitAdapter.EVM }), ...createCallbacks() })).rejects.toThrow(
      'Tx adapter is not Solana',
    );
  });

  test('asks getTransaction at the confirmed commitment', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: 1n, err: null, confirmationStatus: 'confirmed' }],
    });
    getTransaction.mockResolvedValue(txDetails);

    await solanaFetcher({ tx: createTx(), ...createCallbacks() });

    expect(getTransaction).toHaveBeenCalledWith('signature', {
      commitment: 'confirmed',
      encoding: 'json',
      maxSupportedTransactionVersion: 1,
    });
  });

  test('reports success with the details of a version 1 transaction', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 460364569n, confirmations: null, err: null, confirmationStatus: 'finalized' }],
    });
    getTransaction.mockImplementation(getVersion1Transaction);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        slot: 460364569,
        fee: 5540,
        recentBlockhash: 'C24UcwfULj7vCCsM6siPhs3ELFmHpEvPxUpU4kGjNnQz',
        instructions: version1TxDetails.transaction.message.instructions,
      }),
    );
  });

  test('reports the status and keeps polling when getTransaction fails', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: 1n, err: null, confirmationStatus: 'confirmed' }],
    });
    getTransaction.mockRejectedValue(unsupportedVersionError);
    const callbacks = createCallbacks();

    await expect(solanaFetcher({ tx: createTx(), ...callbacks })).resolves.toBeUndefined();

    expect(callbacks.onIntervalTick).toHaveBeenCalledWith({
      slot: 10,
      confirmations: 1,
      err: null,
      confirmationStatus: 'confirmed',
    });
    expect(callbacks.onFailure).not.toHaveBeenCalled();
    expect(callbacks.stopPolling).not.toHaveBeenCalled();
  });

  test('fails right away on an on-chain error when getTransaction fails', async () => {
    const err = { InstructionError: [0, { Custom: 1 }] };
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: 1n, err, confirmationStatus: 'confirmed' }],
    });
    getTransaction.mockRejectedValue(unsupportedVersionError);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onFailure).toHaveBeenCalledWith(expect.objectContaining({ err }));
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('reports success without the details of a finalized transaction on its 10th check without them', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: null, err: null, confirmationStatus: 'finalized' }],
    });
    getTransaction.mockRejectedValue(unsupportedVersionError);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    onTestFinished(() => warn.mockRestore());
    const tx = createTx();
    const callbacks = createCallbacks();

    for (let check = 1; check < 10; check++) {
      await solanaFetcher({ tx, ...callbacks });
    }
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.stopPolling).not.toHaveBeenCalled();

    await solanaFetcher({ tx, ...callbacks });

    expect(getTransaction).toHaveBeenCalledTimes(10);
    expect(callbacks.onSuccess).toHaveBeenCalledWith({
      slot: 10,
      confirmations: 0,
      err: null,
      confirmationStatus: 'finalized',
    });
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
    expect(callbacks.onFailure).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  test('never fails a finalized transaction on the one-hour timeout, even without its details', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: null, err: null, confirmationStatus: 'finalized' }],
    });
    getTransaction.mockResolvedValue(null);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx({ localTimestamp: dayjs().subtract(2, 'hour').unix() }), ...callbacks });

    expect(callbacks.onFailure).not.toHaveBeenCalled();
  });

  test('reports the confirmed status even before the details are available', async () => {
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: 1n, err: null, confirmationStatus: 'confirmed' }],
    });
    getTransaction.mockResolvedValue(null);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onIntervalTick).toHaveBeenCalledWith(
      expect.objectContaining({ slot: 10, confirmations: 1, confirmationStatus: 'confirmed' }),
    );
    expect(callbacks.onSuccess).not.toHaveBeenCalled();
    expect(callbacks.onFailure).not.toHaveBeenCalled();
  });

  test('fails right away on an on-chain error, even before the details are available', async () => {
    const err = { InstructionError: [0, { Custom: 1 }] };
    getSignatureStatuses.mockResolvedValue({
      value: [{ slot: 10n, confirmations: 1n, err, confirmationStatus: 'confirmed' }],
    });
    getTransaction.mockResolvedValue(null);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx(), ...callbacks });

    expect(callbacks.onFailure).toHaveBeenCalledWith(expect.objectContaining({ err }));
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('fails an unknown signature once the chain passes the last valid block height of its blockhash', async () => {
    getSignatureStatuses.mockResolvedValue({ value: [null] });
    getBlockHeight.mockResolvedValue(101n);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx({ lastValidBlockHeight: 100 }), ...callbacks });

    // the signature is checked again after the block height, so a last-moment landing is not missed
    expect(getSignatureStatuses).toHaveBeenCalledTimes(2);
    expect(getBlockHeight).toHaveBeenCalledWith({ commitment: 'confirmed' });
    expect(callbacks.onFailure).toHaveBeenCalledWith(expect.objectContaining({ expired: true }));
    expect(callbacks.stopPolling).toHaveBeenCalledWith({ withoutRemoving: true });
  });

  test('keeps polling an unknown signature while its blockhash is still valid', async () => {
    getSignatureStatuses.mockResolvedValue({ value: [null] });
    getBlockHeight.mockResolvedValue(100n);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx({ lastValidBlockHeight: 100 }), ...callbacks });

    expect(callbacks.onFailure).not.toHaveBeenCalled();
    expect(callbacks.stopPolling).not.toHaveBeenCalled();
  });

  test('does not fail a transaction that landed just before its blockhash expired', async () => {
    getSignatureStatuses
      .mockResolvedValueOnce({ value: [null] })
      .mockResolvedValueOnce({ value: [{ slot: 10n, confirmations: 1n, err: null, confirmationStatus: 'confirmed' }] });
    getBlockHeight.mockResolvedValue(101n);
    getTransaction.mockResolvedValue(txDetails);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx({ lastValidBlockHeight: 100 }), ...callbacks });

    expect(callbacks.onFailure).not.toHaveBeenCalled();
    expect(callbacks.onIntervalTick).toHaveBeenCalledWith(expect.objectContaining({ confirmationStatus: 'confirmed' }));
  });

  test('does not ask the block height without a last valid block height', async () => {
    getSignatureStatuses.mockResolvedValue({ value: [null] });

    await solanaFetcher({ tx: createTx(), ...createCallbacks() });

    expect(getBlockHeight).not.toHaveBeenCalled();
  });

  test('uses the last valid block height recorded by signAndSendSolanaTx when the transaction has none', async () => {
    rememberSolanaTxLifetime('sent-by-helper', 100);
    getSignatureStatuses.mockResolvedValue({ value: [null] });
    getBlockHeight.mockResolvedValue(101n);
    const callbacks = createCallbacks();

    await solanaFetcher({ tx: createTx({ txKey: 'sent-by-helper' }), ...callbacks });

    expect(callbacks.onFailure).toHaveBeenCalledWith(expect.objectContaining({ expired: true }));
  });
});
