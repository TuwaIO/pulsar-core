# Pulsar EVM Adapter & Toolkit

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-evm.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-evm.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

An advanced toolkit for the Pulsar Engine that adds comprehensive support for tracking transactions on EVM-compatible chains. It integrates seamlessly with **Viem** & **Wagmi** and provides multiple tracking strategies, utility actions, and helpers.

---

## 🏛️ What is `@tuwaio/pulsar-evm`?

This package is a powerful, official adapter for `@tuwaio/pulsar-core`. It contains all the necessary logic to interact with EVM-compatible blockchains, acting as the primary logic provider for most dApps.

While its main export is the `pulsarEvmAdapter`, it also includes a suite of standalone trackers, actions, and utilities that can be used for advanced or custom implementations.

---

## ✨ Core Features

- **🔌 Simple Integration:** A single `pulsarEvmAdapter` factory function to easily plug full EVM support into `@tuwaio/pulsar-core`.
- **🎯 Multi-Tracker Support:** Provides distinct, optimized trackers for:
  - **Standard EVM Transactions** (via `evmTracker` and `viem`).
  - **Safe (formerly Gnosis Safe)** Multisig Transactions (via `safeFetcher` and the Safe Transaction Service API).
  - **Gelato Relay** Meta-Transactions (via `gelatoFetcher` and the Gelato API).
- **🤖 Automatic Routing:** The adapter automatically detects the correct tracker to use (Safe, Gelato, or standard EVM) based on the transaction context and wallet type.
- **⚡ Built-in Actions:** Includes ready-to-use functions for common user needs like `speedUpTxAction` and `cancelTxAction`.

---

## 💾 Installation

This package is designed to be used as part of the Pulsar stack and requires `@wagmi/core` and `viem`. Install all necessary packages together:

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/pulsar-evm @tuwaio/pulsar-core @tuwaio/orbit-core @tuwaio/orbit-evm @wagmi/core viem zustand immer dayjs
```

---

## 🚀 Usage

### 1. Primary Usage: The `pulsarEvmAdapter`

For most applications, you'll only need to import the `pulsarEvmAdapter` and pass it to your `createPulsarStore` configuration.

```ts
// src/hooks/txTrackingHooks.ts
import { createBoundedUseStore, createPulsarStore, Transaction } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';

import { appChains, config } from '@/configs/wagmiConfig';

const storageName = 'transactions-tracking-storage';

export enum TxType {
  example = 'example',
}

type ExampleTx = Transaction & {
  type: TxType.example;
  payload: {
    value: number;
  };
};

export type TransactionUnion = ExampleTx;

export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionUnion>({
    name: storageName,
    adapter: pulsarEvmAdapter(config, appChains),
  }),
);
```

### 2. Using Standalone Trackers

You can use `evmTracker` for standard transactions or `initializePollingTracker` with `gelatoFetcher`/`safeFetcher` for polling-based tracking.

#### Standard EVM Tracker

```tsx
import { evmTracker } from '@tuwaio/pulsar-evm';
import { config } from './wagmi'; // Your wagmi config

async function trackMyTransaction(txHash: string, chainId: number) {
  await evmTracker({
    config,
    tx: { txKey: txHash, chainId },
    onTxDetailsFetched: (txDetails) => {
      console.log('Transaction details:', txDetails);
    },
    onSuccess: async (txDetails, receipt, client) => {
      console.log('Transaction mined!', receipt);
    },
    onReplaced: (replacement) => {
      console.log('Transaction replaced:', replacement);
    },
    onFailure: (error) => {
      console.error('Tracking failed:', error);
    },
  });
}
```

### 3. Using Standalone Actions

This package also exports utility actions that you can wire up to your UI for features like speeding up or canceling transactions.

**Example: A button to speed up a stuck transaction**

```tsx
// src/components/SpeedUpButton.tsx
import { speedUpTxAction } from '@tuwaio/pulsar-evm';
import { usePulsarStore } from '../hooks/txTrackingHooks'; // Or your custom hook
import { wagmiConfig } from '../configs/wagmi'; // Your wagmi config

function SpeedUpButton({ txKey }) {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const stuckTransaction = transactionsPool[txKey];

  // Only show the button if the transaction is pending and is a standard EVM tx
  if (!stuckTransaction?.pending || stuckTransaction.tracker !== 'ethereum') {
    return null;
  }

  const handleSpeedUp = async () => {
    try {
      const newTxHash = await speedUpTxAction({
        config: wagmiConfig,
        tx: stuckTransaction,
      });
      console.log('Transaction sped up with new hash:', newTxHash);
      // Pulsar's `executeTxAction` will automatically add and track this new transaction
      // if you integrate it with the action that calls this.
    } catch (error) {
      console.error('Failed to speed up transaction:', error);
    }
  };

  return <button onClick={handleSpeedUp}>Speed Up</button>;
}
```

### 4. Using Standalone Utilities

You can use exported utilities, like selectors or routing functions, to get derived data for your UI.

**Example: Determining the correct tracker**

```tsx
import { checkTransactionsTracker } from '@tuwaio/pulsar-evm';
import { TransactionTracker } from '@tuwaio/pulsar-core';

// Automatically routes to 'gelato', 'safe', or 'ethereum'
const { tracker, txKey } = checkTransactionsTracker('0xabc...', 'injected');
// tracker -> TransactionTracker.Ethereum
```

**Example: Getting a block explorer link for a transaction**

```tsx
// src/components/ExplorerLink.tsx
import { selectEvmTxExplorerLink } from '@tuwaio/pulsar-evm';
import { appChains } from '../configs/wagmi'; // Your wagmi chains

function ExplorerLink({ tx }) {
  // The selector needs your app's chains, and the transaction.
  const explorerLink = selectEvmTxExplorerLink({ chains: appChains, tx });

  if (!explorerLink) return null;

  return (
    <a href={explorerLink} target="_blank" rel="noopener noreferrer">
      View on Explorer
    </a>
  );
}
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
