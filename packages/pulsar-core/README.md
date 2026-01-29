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

This package requires `zustand`, `immer` and `dayjs` as peer dependencies. You must install them alongside `@tuwaio/pulsar-core`.

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/pulsar-core @tuwaio/orbit-core zustand immer dayjs
```

---

## 🚀 API & Usage

### `createPulsarStore(config)`

This is the main factory function that creates your transaction store. It takes a configuration object and returns a fully typed, ready-to-use vanilla Zustand store.

#### **Configuration Example**

```ts
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
    maxTransactions: 100, // Optional: defaults to 50
  }),
);
```

### Transaction Pool Management (FIFO)

To prevent the `localStorage` from growing indefinitely, Pulsar Core implements a **FIFO (First-In, First-Out) Eviction Policy**.

- **Maximum Transactions:** By default, the store keeps the last **50** transactions. You can customize this via the `maxTransactions` property in the `createPulsarStore` config.
- **Eviction Process:** When the pool exceeds the `maxTransactions` limit, the oldest transaction (based on `localTimestamp`) is automatically removed from the state and storage when a new one is added.

### The Returned Store API

The `createPulsarStore` function returns a vanilla Zustand store with the following state and actions:

#### **State**

- `transactionsPool: Record<string, T>`: The primary state object. This is a map of all tracked transactions, where the key is the transaction's unique `txKey` (e.g., a transaction hash).
- `initialTx?: InitialTransaction`: Holds the state of a transaction that is currently being initiated (e.g., waiting for a user's signature) but is not yet submitted to the network. Useful for providing instant UI feedback.
- `lastAddedTxKey?: string`: The `txKey` of the most recently added transaction.

#### **Actions**

- `executeTxAction(params)`: The primary, all-in-one function for initiating, sending, and tracking a new transaction. This is the main action you will use.
- `initializeTransactionsPool()`: An async function to re-initialize trackers for any pending transactions found in storage. **This is crucial for resuming tracking after a page reload.**
- `addTxToPool(tx)`: Adds a new transaction directly to the tracking pool.
- `updateTxParams(txKey, fields)`: Updates one or more properties of an existing transaction in the pool.
- `removeTxFromPool(txKey)`: Removes a transaction from the pool by its key.
- `closeTxTrackedModal(txKey?)`: A helper to manage UI state, which sets `isTrackedModalOpen` to `false` and clears the `initialTx` state.
- `getLastTxKey()`: Returns the `txKey` of the most recently added transaction.

#### **Selectors**

The package also provides a set of selector functions to help you efficiently query the transaction pool:

- `selectAllTransactions(pool)`: Returns all transactions sorted chronologically.
- `selectPendingTransactions(pool)`: Returns only transactions that are currently pending.
- `selectTxByKey(pool, txKey)`: Retrieves a specific transaction by its key.
- `selectAllTransactionsByActiveWallet(pool, address)`: Returns all transactions for a specific wallet.
- `selectPendingTransactionsByActiveWallet(pool, address)`: Returns pending transactions for a specific wallet.

---

## 🛠️ Advanced Usage: `initializePollingTracker`

For custom tracking requirements (like server-side tracking or non-standard APIs), you can use the low-level `initializePollingTracker` utility. This is the same engine used internally by Pulsar adapters for Gelato, Safe, and Solana.

```ts
import { initializePollingTracker } from '@tuwaio/pulsar-core';

await initializePollingTracker({
  tx: myTransaction,
  fetcher: async ({ stopPolling, onSuccess, onFailure }) => {
    const status = await checkMyCustomApi(myTransaction.txKey);
    if (status === 'done') onSuccess(status);
    if (status === 'error') onFailure(status);
  },
  onSuccess: (status) => console.log('Success!', status),
  onFailure: (status) => console.error('Failed!', status),
});
```

---

## ✨ How It Connects to the Ecosystem

Pulsar is a modular ecosystem. Here’s how the pieces fit together:

- **`@tuwaio/pulsar-core`:** Provides the generic, headless state machine (`createPulsarStore`). It knows _how_ to manage state but doesn't know anything about specific blockchains.
- **`@tuwaio/pulsar-evm`**: An adapter that plugs into the `adapters` config. It teaches the core store how to interact with EVM chains (e.g., how to check transaction receipts, get wallet info from Wagmi, etc.).
- **`@tuwaio/pulsar-solana`**: An adapter that plugs into the `adapters` config. It extends the core store to work with the Solana ecosystem, teaching it how to track transactions, get wallet info from `@wallet-ui/react`, and use Solana RPCs.
- **`@tuwaio/pulsar-react`**: Provides React bindings and hooks (like `useInitializeTransactionsPool`) to easily connect the Pulsar store to your React application's lifecycle.

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
