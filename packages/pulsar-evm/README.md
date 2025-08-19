# Pulsar EVM Adapter & Toolkit

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-evm.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-evm.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/main.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

An advanced toolkit for the Pulsar Engine that adds support for tracking transactions on EVM-compatible chains. It integrates with Viem and Wagmi and provides multiple tracking strategies, utility actions, and helpers.

## 🏛️ What is `@tuwaio/pulsar-evm`?

This package is a powerful extension for `@tuwaio/pulsar-core`. It contains all the necessary logic to interact with EVM-compatible blockchains, acting as the primary logic provider for most dApps.

While its main export is the `evmAdapter`, it also includes a suite of standalone trackers, actions, and utilities for advanced use cases.

## ✨ Core Features

-   **🔌 Simple Integration:** A single `evmAdapter` to easily plug EVM support into `pulsar-core`.
-   **🎯 Multi-Tracker Support:** Provides distinct, optimized trackers for:
    -   **Standard EVM Transactions** (via transaction hash)
    -   **Gnosis Safe** Transactions (via Safe Transaction Service API)
    -   **Gelato Relay** Meta-Transactions (via Gelato API)
-   **🤖 Automatic Routing:** The system automatically detects the correct tracker to use (Safe, Gelato, or standard EVM) based on the transaction context.
-   **⚡ Built-in Actions:** Includes ready-to-use functions for common user needs like `speedUpTxAction` and `cancelTxAction`.
-   **🛠️ Utility Suite:** Exports a rich set of helpers, including ENS resolvers and explorer link generators (`selectEvmTxExplorerLink`).

## 💾 Installation

This package is designed to be used as part of the Pulsar stack. Install all required packages together:

```bash
pnpm add @tuwaio/pulsar-evm @tuwaio/pulsar-core wagmi viem zustand immer
```

## 🚀 Usage

### 1. Primary Usage: The `evmAdapter`

For most applications, you'll only need to import the `evmAdapter` and pass it to your `createPulsarStore` configuration.

```ts
import { createPulsarStore } from '@tuwaio/pulsar-core';
import { evmAdapter } from '@tuwaio/pulsar-evm';
import { createConfig, http } from '@wagmi/core';
import { mainnet, sepolia } from 'wagmi/chains';

// 1. Create your Wagmi config
const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// 2. Create the Pulsar store and pass the evmAdapter
const pulsarStore = createPulsarStore({
  name: 'my-dapp-transactions',
  
  // Plug in the EVM adapter with its config
  adapters: [
    evmAdapter(wagmiConfig, [mainnet, sepolia]),
  ],
});
```

### 2. Using Standalone Actions

This package also exports utility actions that you can wire up to your UI.

**Example: Speeding up a stuck transaction**

```tsx
import { speedUpTxAction } from '@tuwaio/pulsar-evm';
import { usePulsar } from '@tuwaio/pulsar-react'; // Or your custom hook
import { wagmiConfig } from './wagmi'; // Your wagmi config

function TransactionDetails({ txKey }) {
  const { transactionsPool } = usePulsar();
  const stuckTransaction = transactionsPool[txKey];

  const handleSpeedUp = async () => {
    try {
      const newTxHash = await speedUpTxAction({
        config: wagmiConfig,
        tx: stuckTransaction,
      });
      console.log('Transaction sped up with new hash:', newTxHash);
      // Pulsar will automatically track this new transaction
    } catch (error) {
      console.error('Failed to speed up transaction:', error);
    }
  };

  return (
    <div>
      {/* ... your component UI ... */}
      <button onClick={handleSpeedUp}>Speed Up</button>
    </div>
  );
}
```

### 3. Using Standalone Utilities

You can use exported utilities, like selectors, to get derived data.

**Example: Getting a block explorer link**

```tsx
import { selectEvmTxExplorerLink } from '@tuwaio/pulsar-evm';
import { usePulsar } from '@tuwaio/pulsar-react';
import { mainnet, sepolia } from 'viem/chains';

function TxLink({ txKey }) {
    const { transactionsPool } = usePulsar();
    const explorerLink = selectEvmTxExplorerLink(
        transactionsPool,
        [mainnet, sepolia], // Your app's chains
        txKey
    );

    if (!explorerLink) return null;

    return <a href={explorerLink} target="_blank" rel="noopener noreferrer">View on Explorer</a>
}
```

## 🤝 Contributing

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

This project is licensed under the **Apache-2.0 License**.