# Pulsar Core

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-core.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-core)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

The core, framework-agnostic engine for real-time tracking of Web3 transaction lifecycles (pending, success, failed, replaced).

---

## 🏛️ What is `@tuwaio/pulsar-core`?

`@tuwaio/pulsar-core` is the central nervous system of the Pulsar ecosystem. It is a **headless** and **framework-agnostic** library, meaning it contains no UI components or framework-specific code (like React hooks).

Its sole purpose is to provide a powerful state machine for managing multi-chain transactions, built on top of **Zustand** (for state management) and **Immer** (for immutable updates). Think of it as a pre-configured, extensible "brain" that you can integrate into any JavaScript or TypeScript application to handle complex transaction tracking logic with ease.

This package exports one primary factory function: `createPulsarStore`.

---

## ✨ Key Features

- **Framework-Agnostic:** Use it with React, Vue, Svelte, or even in a Node.js environment.
- **Multi-Chain by Design:** Built to handle different blockchain architectures via a powerful adapter system.
- **Persistent State:** Automatically saves transaction state to `localStorage`, allowing tracking to resume after a page refresh.
- **Extensible:** Customize its behavior with adapters, callbacks, and custom trackers.
- **Type-Safe:** Written entirely in TypeScript for a robust developer experience.

---

## 💾 Installation

This package requires `zustand` and `immer` as peer dependencies. You must install them alongside `@tuwaio/pulsar-core`.

```bash
# Using pnpm
pnpm add @tuwaio/pulsar-core zustand immer

# Using npm
npm install @tuwaio/pulsar-core zustand immer

# Using yarn
yarn add @tuwaio/pulsar-core zustand immer
```

---

## 🚀 API & Usage

### `createPulsarStore(config)`

This is the main factory function that creates your transaction store. It takes a configuration object and returns a fully typed, ready-to-use vanilla Zustand store.

#### **Configuration Example**

```ts
import { createPulsarStore } from '@tuwaio/pulsar-core';
// Example adapter for EVM chains
import { evmAdapter } from '@tuwaio/pulsar-evm';
import { wagmiConfig, chains } from './path/to/your/wagmi/config';

const pulsarStore = createPulsarStore({
  // A unique name for Zustand's persistence middleware. This will be the key in localStorage.
  name: 'my-app-pulsar-storage',

  // An array of adapters for different blockchain ecosystems.
  // Each adapter provides chain-specific logic.
  adapter: [
    evmAdapter(wagmiConfig, chains),
    // ... add other adapters like solanaAdapter here
  ],

  // (Optional) A callback function to execute on every successful transaction.
  // Ideal for global logic like showing a success notification.
  onSucceedCallbacks: (tx) => {
    console.log('Transaction succeeded!', tx);
    // e.g., showToast('Success!', { type: 'success' });
  },
});

export default pulsarStore;
```

### The Returned Store API

The `createPulsarStore` function returns a vanilla Zustand store with the following state and actions:

#### **State**

- `transactionsPool: Record<string, T>`: The primary state object. This is a map of all tracked transactions, where the key is the transaction's unique `txKey` (e.g., a transaction hash).
- `initialTx?: InitialTransaction`: Holds the state of a transaction that is currently being initiated (e.g., waiting for a user's signature) but is not yet submitted to the network. Useful for providing instant UI feedback.
- `lastAddedTxKey?: string`: The `txKey` of the most recently added transaction.

#### **Actions**

- `handleTransaction(params)`: The primary, all-in-one function for initiating, sending, and tracking a new transaction. This is the main action you will use.
- `initializeTransactionsPool()`: An async function to re-initialize trackers for any pending transactions found in storage. **This is crucial for resuming tracking after a page reload.**
- `addTxToPool(tx)`: Adds a new transaction directly to the tracking pool.
- `updateTxParams(txKey, fields)`: Updates one or more properties of an existing transaction in the pool.
- `removeTxFromPool(txKey)`: Removes a transaction from the pool by its key.
- `closeTxTrackedModal(txKey?)`: A helper to manage UI state, which sets `isTrackedModalOpen` to `false` and clears the `initialTx` state.

---

## ✨ How It Connects to the Ecosystem

Pulsar is a modular ecosystem. Here’s how the pieces fit together:

- **`@tuwaio/pulsar-core` (this package):** Provides the generic, headless state machine (`createPulsarStore`). It knows _how_ to manage state but doesn't know anything about specific blockchains.
- **`@tuwaio/pulsar-evm`**: An adapter that plugs into the `adapters` config. It teaches the core store how to interact with EVM chains (e.g., how to check transaction receipts, get wallet info from Wagmi, etc.).
- **`@tuwaio/pulsar-react`**: Provides React bindings and hooks (like `useInitializeTransactionsPool`) to easily connect the Pulsar store to your React application's lifecycle.

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
