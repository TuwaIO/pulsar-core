# Pulsar Core

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-core.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-core)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

Tier 3 of the TUWA Ecosystem. Framework-agnostic headless core store providing append-only localStorage transaction history ledgers.

---

## 🏛️ What is `@tuwaio/pulsar-core`?

`@tuwaio/pulsar-core` is the framework-agnostic, zero-dependency client-side ledger layer of the Pulsar ecosystem. It contains no visual interface components or framework-specific render hooks.

Its single purpose is to act as a headless state machine providing deterministic transaction status reconciliation and client-side state persistence across user sessions. Built on top of **Zustand** and **Immer**, it maintains transaction pool stability using persistent browser storage engines to secure an append-only transaction ledger.

This package exports one primary factory function: `createPulsarStore`.

---

## ✨ Key Features

- **Framework-Agnostic:** Orchestrate and integrate state logic into any environment (React, Vue, Svelte, or Node.js).
- **Multi-Chain by Design:** Isolated state machine adapter system to support heterogeneous blockchain networks.
- **Persistent State:** Client-side state persistence powered by browser storage engines to resume lifecycle tracking across refreshes.
- **Append-Only Ledger:** High-stability transaction pool management using FIFO eviction policies.
- **Type-Safe:** Zero-compromise TypeScript implementation with explicit interfaces.

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
    beforeTxProcess: async () => {
      // Optional global preflight. Throw here to block a transaction before wallet interaction.
      await assertUserCanSubmitTransactions();
    },
  }),
);
```

### Transaction Pool Management (FIFO)

To prevent the `localStorage` from growing indefinitely, Pulsar Core implements a **FIFO (First-In, First-Out) Eviction Policy**.

- **Maximum Transactions:** By default, the store keeps the last **50** transactions. You can customize this via the `maxTransactions` property in the `createPulsarStore` config.
- **Eviction Process:** When the pool exceeds the `maxTransactions` limit, the oldest transaction (based on `localTimestamp`) is automatically removed from the state and storage when a new one is added.

### Transaction Metadata Safety

Pulsar validates transaction metadata before it creates `initialTx`, calls the wallet action, writes to the local transaction pool, persists to `localStorage`, or calls `onRemoteCreate`.

- `title`: each string must be **100 characters or less**.
- `description`: each string must be **300 characters or less**.
- `payload`: must be JSON-serializable and **10KB or less** after UTF-8 JSON serialization.
- `title`, `description`, and payload string values reject executable-like patterns such as `eval(`, `Function(`, `setTimeout("...")`, `setInterval("...")`, and `javascript:`.

This validation is a defensive metadata gate, not a replacement for output escaping or HTML sanitization in UI code.

Invalid transactions are rejected before execution. Invalid pending transactions restored from persisted storage are removed during `initializeTransactionsPool()`. Invalid remote transactions passed to `injectExternalPendingTxs()` are skipped with a warning so the rest of the batch can still sync.

### `beforeTxProcess`

Use `beforeTxProcess` for custom preflight policies such as auth checks, feature flags, rate limits, or application-level transaction guards. The callback receives no transaction metadata; throw an error to block the transaction before initialization or wallet interaction.

```ts
const store = createPulsarStore<TransactionUnion>({
  name: storageName,
  adapter: pulsarEvmAdapter(config, appChains),
  beforeTxProcess: async () => {
    await assertUserCanSubmitTransactions();
  },
});
```

You can override the global callback for one transaction by passing `beforeTxProcess` to `executeTxAction`.

```ts
await store.getState().executeTxAction({
  actionFunction: sendSwap,
  beforeTxProcess: async () => {
    await assertSwapIsEnabled();
  },
  params: {
    adapter: OrbitAdapter.EVM,
    desiredChainID: 1,
    type: 'SWAP',
    title: 'Swap',
    description: 'Swap tokens',
  },
});
```

When a local callback is provided to `executeTxAction`, it replaces the global callback for that action.

### `abortOnTxError`

Use the `abortOnTxError` parameter (defaults to `true`) to control error propagation during transaction preflight and remote synchronization:

- **Preflight hook (`beforeTxProcess`)**:
  - When `abortOnTxError` is `true` (default), any error thrown in `beforeTxProcess` will populate the `initialTx.error` state and throw, aborting the transaction action immediately.
  - When `abortOnTxError` is `false`, any error thrown in `beforeTxProcess` is caught, logged to the console as a warning, and the transaction execution continues.
- **Remote sync hook (`onRemoteCreate`)**:
  - Errors in `onRemoteCreate` **always** abort the transaction flow (the transaction is not added to the local tracking pool, `initialTx.error` is populated, and the error is thrown) regardless of the `abortOnTxError` setting.

You can set `abortOnTxError` globally during store creation or override it locally in `executeTxAction`:

```ts
// Set globally (defaults to true if not provided)
const store = createPulsarStore<TransactionUnion>({
  name: storageName,
  adapter: pulsarEvmAdapter(config, appChains),
  abortOnTxError: false, // Disable aborting for beforeTxProcess errors globally
});

// Override locally for a specific action
await store.getState().executeTxAction({
  actionFunction: sendSwap,
  abortOnTxError: true, // Force abort on beforeTxProcess errors for this action
  params: {
    adapter: OrbitAdapter.EVM,
    desiredChainID: 1,
    type: 'SWAP',
    title: 'Swap',
    description: 'Swap tokens',
  },
});
```

### The Returned Store API

The `createPulsarStore` function returns a vanilla Zustand store with the following state and actions:

#### **State**

- `transactionsPool: Record<string, T>`: The primary state object. This is a map of all tracked transactions, where the key is the transaction's unique `txKey` (e.g., a transaction hash).
- `initialTx?: InitialTransaction`: Holds the state of a transaction that is currently being initiated (e.g., waiting for a user's signature) but is not yet submitted to the network. Useful for providing instant UI feedback.
- `lastAddedTxKey?: string`: The `txKey` of the most recently added transaction.

#### **Actions**

- `executeTxAction(params)`: The primary, all-in-one function for initiating, sending, and tracking a new transaction. It runs `beforeTxProcess` and metadata validation before wallet interaction.
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

### `createTxInMemoryStore({ ... })`

While `createPulsarStore` is the primary entry point for tracking _active_ transactions, `createTxInMemoryStore` provides an in-memory transaction store with synchronized local and remote sources. It is designed to keep a local transaction pool in sync with remote history, preserve terminal transaction states, and support paginated history loading.

#### **Configuration Example**

```ts
// src/app/actions - next js app routes example of server actions
'use server';

import { Quasar, Transaction } from '@tuwaio/quasar-sdk';

const quasar = new Quasar({
  secretKey: process.env.QUASAR_SDK_SK ?? '',
});

// --- Server Action for syncCreate ---
export async function syncTransaction(tx: Transaction) {
  try {
    console.log('Syncing tx to Quasar...', tx.txKey);

    await quasar.pulsar.syncCreate(tx, RP_NAME);

    return { success: true };
  } catch (error) {
    console.error('Sync failed', error);
    throw error;
  }
}

// --- Server Action for getHistory ---
export async function getHistory(params?: {
  walletAddress: string;
  page?: number;
  limit?: number;
  chainId?: string;
  status?: string;
  txKey?: string;
  appName?: string;
}) {
  try {
    const history = await quasar.pulsar.getHistory({
      ...params,
    });

    return history;
  } catch (error) {
    console.error('Get history failed', error);
    throw error;
  }
}
```

```ts
// src/store/pulsarStoreHook.ts - pulsar store hook example

'use client';

import { createBoundedUseStore, createPulsarStore, createTxInMemoryStore } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';

import { appChains, config } from '@/configs/wagmiConfig';
import { getHistory, syncTransaction } from '@/app/actions';

const storageName = 'transactions-tracking-storage-with-bd';

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

const initialStore = createPulsarStore<TransactionUnion>({
  name: storageName,
  adapter: [pulsarEvmAdapter(config, appChains)],
  onRemoteCreate: async (tx) => {
    await syncTransaction(tx);
  },
});

export const usePulsarStore = createBoundedUseStore(initialStore);

const pulsarInMemoryStore = createTxInMemoryStore<TransactionUnion>({
  localTransactionsPool: initialStore.getState().transactionsPool,

  getHistory: async ({ page, walletAddress }) => {
    try {
      const history = await getHistory({
        walletAddress,
        page,
        limit: 10,
        appName: 'Example App',
      });

      if (!history) {
        return null;
      }

      return {
        ...history,
        docs: history.docs as TransactionUnion[],
      };
    } catch (error) {
      console.error('[PulsarHook] Failed to fetch history:', error);
      throw error;
    }
  },

  onHistoryFetched: async (remoteTxs) => {
    await initialStore.getState().injectExternalPendingTxs(remoteTxs);
  },
});

initialStore.subscribe((state) => pulsarInMemoryStore.getState().syncWithLocalPool(state.transactionsPool));

export const usePulsarInMemoryStore = createBoundedUseStore(pulsarInMemoryStore);
```

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
