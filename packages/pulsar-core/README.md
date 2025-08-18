# Pulsar Core

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-core.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-core)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/main.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

The core, framework-agnostic engine for real-time tracking of Web3 transaction lifecycles (pending, success, failed, replaced).

## 🏛️ What is `@tuwaio/pulsar-core`?

`@tuwaio/pulsar-core` is the central nervous system of the Pulsar transaction tracking engine. It is a **headless** and **framework-agnostic** library, meaning it contains no UI or framework-specific code (like React).

Its sole purpose is to provide a powerful state machine for managing transactions, built on top of **Zustand** and **Immer**. Think of it as a pre-configured, extensible "brain" that you can integrate into any JavaScript/TypeScript application.

This package exports one primary function: `createPulsarStore`.

## 💾 Installation

This package has `zustand` and `immer` as peer dependencies, so you must install them in your project.

```bash
pnpm add @tuwaio/pulsar-core zustand immer
```

## 🚀 API & Usage

### `createPulsarStore(config)`

This is the main factory function that creates your transaction store. It takes a configuration object and returns a ready-to-use Zustand store.

#### Configuration

```ts
import { createPulsarStore } from '@tuwaio/pulsar-core';
import { evmAdapter } from '@tuwaio/pulsar-evm'; // Example adapter
import { mainnet, sepolia } from 'viem/chains';

const pulsarStore = createPulsarStore({
  // Unique name for Zustand's persistence middleware (localStorage key)
  name: 'pulsar-storage',

  // Array of chains supported by your dApp (from viem/chains)
  appChains: [mainnet, sepolia],

  // (Optional) An array of adapters for different blockchain ecosystems
  adapters: [
    evmAdapter({
      // EVM-specific config
    }),
  ],

  // (Optional) Callbacks to execute on successful transaction
  onSucceedCallbacks: {
    onTxSucceed: (tx) => console.log('Transaction succeeded!', tx),
    onNotificationSucceed: (tx) => console.log('User notified of success!', tx),
  },
});
```

### The Returned Store

The `createPulsarStore` function returns a Zustand store with the following state and actions:

#### State
-   `transactions: Transaction[]`: An array of all tracked transactions.
-   `trackedTxs: TrackedTx[]`: A map of currently tracked transactions with their real-time status.
-   `isInitialized: boolean`: A flag indicating if the store has been initialized.

#### Actions
-   `track(args)`: The primary function to start tracking a new transaction.
-   `initializeTransactionsPool(args)`: An async function to re-initialize the store and resume tracking pending transactions from storage.

## ✨ How it Connects to the Ecosystem

-   **`@tuwaio/pulsar-core` (this package):** Provides the generic state machine (`createPulsarStore`).
-   **`@tuwaio/pulsar-evm`**: An adapter that plugs into the `adapters` config to provide EVM-specific logic.
-   **`@tuwaio/pulsar-react`**: Provides React bindings (`useInitializeTransactionsPool`) to easily reactivate tracking transactions after page reload.

## 🤝 Contributing

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

This project is licensed under the **Apache-2.0 License**.