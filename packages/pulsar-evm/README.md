# Pulsar EVM Adapter

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-evm.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-evm.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/main.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

An adapter for the Pulsar Engine that adds support for tracking transactions on EVM-compatible chains. Integrates with Viem and Wagmi to provide real-time status updates.

## 🏛️ What is `@tuwaio/pulsar-evm`?

This package is a **logic adapter** that plugs into `@tuwaio/pulsar-core`. It contains all the necessary logic to interact with EVM-compatible blockchains (like Ethereum, Polygon, etc.) using popular libraries like **Viem** and **Wagmi**.

Its primary responsibility is to:
-   Monitor pending transactions.
-   Fetch transaction receipts.
-   Determine the final status (success, failed, replaced).
-   Report these status changes back to the central `pulsar-core` store.

This package is **headless** and **framework-agnostic**.

## 💾 Installation

This package is designed to be used as part of the Pulsar stack. Install all required packages together:

```bash
pnpm add @tuwaio/pulsar-evm @tuwaio/pulsar-core wagmi viem zustand immer
```

## 🚀 Usage

This package exports a single main function, `evmAdapter`, which you pass to the `adapters` array when creating your Pulsar store.

### `evmAdapter(config)`

The adapter function takes a configuration object.

-   `wagmiConfig`: **(Required)** Your application's Wagmi config object. The adapter uses this to interact with the blockchain.

### Example

Here’s how to create a Pulsar store and enable EVM support by passing the `evmAdapter`.

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
  appChains: [mainnet, sepolia],
  
  // Plug in the EVM adapter here
  adapters: [
    evmAdapter({
      wagmiConfig: wagmiConfig,
    }),
  ],
});

// 3. Now the store is ready to be used with @tuwaio/pulsar-react
// or in any other environment.
```
Once configured, the Pulsar store will automatically use this adapter to handle any EVM-based transactions that are passed to its `track` function.

## 🤝 Contributing

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

This project is licensed under the **Apache-2.0 License**.