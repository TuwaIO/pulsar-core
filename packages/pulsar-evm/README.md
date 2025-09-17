# Pulsar EVM Adapter & Toolkit

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-evm.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-evm.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

An advanced toolkit for the Pulsar Engine that adds comprehensive support for tracking transactions on EVM-compatible chains. It integrates seamlessly with **Viem** & **Wagmi** and provides multiple tracking strategies, utility actions, and helpers.

---

## 🏛️ What is `@tuwaio/pulsar-evm`?

This package is a powerful, official adapter for `@tuwaio/pulsar-core`. It contains all the necessary logic to interact with EVM-compatible blockchains, acting as the primary logic provider for most dApps.

While its main export is the `evmAdapter`, it also includes a suite of standalone trackers, actions, and utilities that can be used for advanced or custom implementations.

---

## ✨ Core Features

- **🔌 Simple Integration:** A single `evmAdapter` factory function to easily plug full EVM support into `@tuwaio/pulsar-core`.
- **🎯 Multi-Tracker Support:** Provides distinct, optimized trackers for:
  - **Standard EVM Transactions** (via transaction hash polling `viem`).
  - **Safe (formerly Gnosis Safe)** Multisig Transactions (via the Safe Transaction Service API).
  - **Gelato Relay** Meta-Transactions (via the Gelato API).
- **🤖 Automatic Routing:** The adapter automatically detects the correct tracker to use (Safe, Gelato, or standard EVM) based on the transaction context and wallet type.
- **⚡ Built-in Actions:** Includes ready-to-use functions for common user needs like `speedUpTxAction` and `cancelTxAction`.
- **🛠️ Utility Suite:** Exports a rich set of helpers, including **ENS resolvers** (`getName`, `getAvatar`) and an explorer link generator (`selectEvmTxExplorerLink`).

---

## 💾 Installation

This package is designed to be used as part of the Pulsar stack and requires `wagmi` and `viem`. Install all necessary packages together:

```bash
# Using pnpm
pnpm add @tuwaio/pulsar-evm @tuwaio/pulsar-core wagmi viem zustand immer

# Using npm
npm install @tuwaio/pulsar-evm @tuwaio/pulsar-core wagmi viem zustand immer

# Using yarn
yarn add @tuwaio/pulsar-evm @tuwaio/pulsar-core wagmi viem zustand immer
```

---

## 🚀 Usage

### 1\. Primary Usage: The `evmAdapter`

For most applications, you'll only need to import the `evmAdapter` and pass it to your `createPulsarStore` configuration.

```ts
// src/store/pulsarStore.ts
import { createPulsarStore } from '@tuwaio/pulsar-core';
import { evmAdapter } from '@tuwaio/pulsar-evm';
import { wagmiConfig, chains } from '../configs/wagmi'; // Your wagmi config

// Create the Pulsar store and plug in the EVM adapter
export const pulsarStore = createPulsarStore({
  // A unique name for localStorage persistence
  name: 'my-dapp-transactions',
  // Provide the evmAdapter with your wagmi config and supported chains
  adapter: evmAdapter(wagmiConfig, chains),
});
```

### 2\. Using Standalone Actions

This package also exports utility actions that you can wire up to your UI for features like speeding up or canceling transactions.

**Example: A button to speed up a stuck transaction**

```tsx
// src/components/SpeedUpButton.tsx
import { speedUpTxAction } from '@tuwaio/pulsar-evm';
import { usePulsar } from '@tuwaio/pulsar-react'; // Or your custom hook
import { wagmiConfig } from '../configs/wagmi'; // Your wagmi config

function SpeedUpButton({ txKey }) {
  const { transactionsPool } = usePulsar();
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
      // Pulsar's `handleTransaction` will automatically add and track this new transaction
      // if you integrate it with the action that calls this.
    } catch (error) {
      console.error('Failed to speed up transaction:', error);
    }
  };

  return <button onClick={handleSpeedUp}>Speed Up</button>;
}
```

### 3\. Using Standalone Utilities

You can use exported utilities, like selectors, to get derived data for your UI.

**Example: Getting a block explorer link for a transaction**

```tsx
// src/components/ExplorerLink.tsx
import { selectEvmTxExplorerLink } from '@tuwaio/pulsar-evm';
import { usePulsar } from '@tuwaio/pulsar-react';
import { chains } from '../configs/wagmi'; // Your wagmi config

function ExplorerLink({ tx }) {
  // The selector needs your app's chains, and the transaction.
  const explorerLink = selectEvmTxExplorerLink({ chains, tx });

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
