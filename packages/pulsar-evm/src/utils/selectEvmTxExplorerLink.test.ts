import { OrbitAdapter } from '@tuwaio/orbit-core';
import { EvmTransaction, TransactionTracker } from '@tuwaio/pulsar-core';
import { arbitrum, mainnet, sepolia } from 'viem/chains';
import { describe, expect, it } from 'vitest';

import { selectEvmTxExplorerLink } from './selectEvmTxExplorerLink';

describe('selectEvmTxExplorerLink', () => {
  const chains = [mainnet, sepolia, arbitrum] as const;

  it('returns Safe UI link for Safe transactions', () => {
    const link = selectEvmTxExplorerLink({
      chains,
      tx: {
        adapter: OrbitAdapter.EVM,
        tracker: TransactionTracker.Safe,
        chainId: sepolia.id,
        from: '0x1234567890123456789012345678901234567890',
        txKey: '0xmockSafeTxKey',
      } as unknown as EvmTransaction,
    });

    expect(link).toBe(
      'https://app.safe.global/sep:0x1234567890123456789012345678901234567890/transactions/tx?id=multisig_0x1234567890123456789012345678901234567890_0xmockSafeTxKey',
    );
  });

  it('returns native explorer URL for pending ERC-4337 UserOperations using UserOp hash', () => {
    const link = selectEvmTxExplorerLink({
      chains,
      tx: {
        adapter: OrbitAdapter.EVM,
        tracker: TransactionTracker.ERC4337,
        chainId: sepolia.id,
        txKey: '0x1faf8bda15b6e7abc620db9b23af8af286545142ba973ab318ac4d46980920ce',
      } as unknown as EvmTransaction,
    });

    expect(link).toBe(
      'https://sepolia.etherscan.io/tx/0x1faf8bda15b6e7abc620db9b23af8af286545142ba973ab318ac4d46980920ce',
    );
  });

  it('returns native block explorer URL when ERC-4337 UserOp has a mined tx.hash', () => {
    const link = selectEvmTxExplorerLink({
      chains,
      tx: {
        adapter: OrbitAdapter.EVM,
        tracker: TransactionTracker.ERC4337,
        chainId: sepolia.id,
        txKey: '0xuserOpHash',
        hash: '0xminedOnChainTxHash',
      } as unknown as EvmTransaction,
    });

    expect(link).toBe('https://sepolia.etherscan.io/tx/0xminedOnChainTxHash');
  });

  it('returns standard explorer URL for standard EVM transactions', () => {
    const link = selectEvmTxExplorerLink({
      chains,
      tx: {
        adapter: OrbitAdapter.EVM,
        chainId: mainnet.id,
        txKey: '0xstandardTxKey',
        hash: '0xstandardHash',
      } as unknown as EvmTransaction,
    });

    expect(link).toBe('https://etherscan.io/tx/0xstandardHash');
  });

  it('prioritizes replacedTxHash for speed-up/cancel transactions', () => {
    const link = selectEvmTxExplorerLink({
      chains,
      tx: {
        adapter: OrbitAdapter.EVM,
        chainId: arbitrum.id,
        txKey: '0xoriginalTxKey',
        hash: '0xoriginalHash',
        replacedTxHash: '0xspeedUpTxHash',
      } as unknown as EvmTransaction,
    });

    expect(link).toBe('https://arbiscan.io/tx/0xspeedUpTxHash');
  });
});
