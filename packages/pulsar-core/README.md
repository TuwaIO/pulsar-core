# @tuwaio/pulsar-core

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-core.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-core)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-core.svg)](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/LICENSE)

`@tuwaio/pulsar-core` is the Layer 3 (L3) core package of **Pulsar**, the transaction tracking project of TUWA Stage 2 ("State & Connection", next to Satellite Connect). Built on **`zustand`** (with the `persist` middleware), **`immer`** and **`@tuwaio/orbit-core`**, it keeps the pool of tracked transactions, runs new transactions through chain adapters and restarts their trackers after a page reload. It has no chain logic, UI or network requests of its own: the chain adapters are [`@tuwaio/pulsar-evm`](https://pulsar.docs.tuwa.io/packages/pulsar-evm) and [`@tuwaio/pulsar-solana`](https://pulsar.docs.tuwa.io/packages/pulsar-solana).

---

## 🏛️ Core Capabilities

- **Transaction store:** `createPulsarStore` returns a vanilla Zustand store. Its `executeTxAction` validates the metadata, sets `initialTx` for immediate UI feedback, checks the wallet's chain, runs the `beforeTxProcess` preflight, calls your `actionFunction` to sign and submit, adds the transaction to `transactionsPool` and starts its tracker.
- **Chain adapters:** pass one adapter or an array. Each transaction goes to the adapter whose `key` matches its `adapter` (the first adapter when none matches). Adapters implement the `TxAdapter` contract, so other chains can be added.
- **Persistence and resume:** the pool is saved to `localStorage` (see Browser Storage below). After a reload, `initializeTransactionsPool` restarts the trackers of pending transactions. The pool keeps at most `maxTransactions` (default 50) and evicts the oldest one.
- **Metadata safety:** each `title` string is limited to 100 characters, each `description` string to 300 and the JSON of `payload` to 10 KB, and strings must not contain executable-like patterns (`eval(`, `Function(`, `setTimeout`/`setInterval` with a string, `javascript:`). Invalid metadata throws `PulsarTransactionValidationError` before anything runs; invalid restored or remote transactions are dropped. This is a defensive gate, not a replacement for escaping output in your UI.
- **Remote sync:** `onRemoteCreate` sends every new transaction to your backend (for example Quasar) in the background, without its API keys, retries unconfirmed syncs later, and never delays or blocks tracking. `injectExternalPendingTxs` and `createTxInMemoryStore` bring the remote history back into the app; both drop transactions that fail validation.
- **Selectors and React binding:** `selectAllTransactions`, `selectPendingTransactions`, `selectTxByKey` and the `…ByActiveWallet` variants; `createBoundedUseStore` turns the store into a typed React hook.
- **Tracker building blocks:** `initializePollingTracker` (a polling loop with consecutive-failure retries) and `createTxUpdater` (keeps a tracker's copy of the transaction in sync with its store updates) for custom trackers.

---

## 💾 Installation

```bash
pnpm add @tuwaio/pulsar-core @tuwaio/orbit-core zustand immer dayjs
```

> [!IMPORTANT]
> `@tuwaio/orbit-core` (>=0.3), `zustand` (5.x), `immer` (11.x) and `dayjs` (1.x) are peer dependencies and must be installed alongside `@tuwaio/pulsar-core`. Add [`@tuwaio/pulsar-evm`](https://pulsar.docs.tuwa.io/packages/pulsar-evm) and/or [`@tuwaio/pulsar-solana`](https://pulsar.docs.tuwa.io/packages/pulsar-solana) for the chain adapters, and [`@tuwaio/pulsar-react`](https://pulsar.docs.tuwa.io/packages/pulsar-react) for React apps.

---

## 🚀 Usage

### Creating the store and sending a transaction

```typescript
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createPulsarStore, type EvmTransaction, TransactionStatus } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { createConfig, http, injected, sendTransaction } from '@wagmi/core';
import { sepolia } from 'viem/chains';

const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: { [sepolia.id]: http() },
});

export const pulsarStore = createPulsarStore<EvmTransaction>({
  name: 'pulsar-transactions', // localStorage key
  adapter: pulsarEvmAdapter(wagmiConfig, [sepolia]),
});

// Once per page load, on the client: resume the transactions that were pending before a reload.
void pulsarStore.getState().initializeTransactionsPool();

export async function sendTip(to: `0x${string}`) {
  await pulsarStore.getState().executeTxAction({
    actionFunction: () => sendTransaction(wagmiConfig, { to, value: 1_000_000_000_000_000n }),
    params: {
      adapter: OrbitAdapter.EVM,
      desiredChainID: sepolia.id,
      type: 'tip',
      title: ['Sending tip', 'Tip sent', 'Tip failed', 'Tip replaced'],
    },
    onSuccess: (tx) => console.log(tx.txKey, tx.status === TransactionStatus.Success),
  });
}

// Read the state anywhere; `pulsarStore.subscribe` notifies you about changes.
pulsarStore.subscribe((state) => {
  const pending = Object.values(state.transactionsPool).filter((tx) => tx.pending);
  console.log(`${pending.length} pending transaction(s)`);
});
```

`executeTxAction` rejects when the metadata is invalid, the wallet is on another chain and does not switch, `beforeTxProcess` throws (unless `abortOnTxError: false`) or the wallet rejects the transaction; `initialTx.error` holds the normalized error. For standard EVM transactions it resolves only when tracking has finished, so drive the UI from the store instead of awaiting it.

The full React setup, with a wallet connector, typed transactions and the Solana variant, is in the **[React transaction tracking guide](https://docs.tuwa.io/guides/react-transaction-tracking)**.

### Preflight checks

`beforeTxProcess` runs after the chain check and before the wallet is asked to sign. Throw to block the transaction; a `beforeTxProcess` passed to `executeTxAction` replaces the global one for that transaction:

```typescript
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createPulsarStore, type EvmTransaction } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { type Config } from '@wagmi/core';
import { sepolia } from 'viem/chains';

declare const wagmiConfig: Config;
declare function sendSwap(): Promise<`0x${string}`>;

const pulsarStore = createPulsarStore<EvmTransaction>({
  name: 'pulsar-transactions',
  adapter: pulsarEvmAdapter(wagmiConfig, [sepolia]),
  beforeTxProcess: () => {
    if (!navigator.onLine) throw new Error('You are offline.');
  },
});

await pulsarStore.getState().executeTxAction({
  actionFunction: sendSwap,
  beforeTxProcess: async () => {
    const response = await fetch('/api/swaps/enabled');
    if (!response.ok) throw new Error('Swaps are paused.');
  },
  params: { adapter: OrbitAdapter.EVM, desiredChainID: sepolia.id, type: 'swap', title: 'Swap' },
});
```

With `abortOnTxError: false` (globally or per call), a `beforeTxProcess` error is logged and the transaction continues. `abortOnTxError` does not apply to `onRemoteCreate`.

### Remote sync and recovery

Pass `onRemoteCreate` to send every new transaction to your backend, for example a server action that forwards it to [Quasar](https://docs.tuwa.io/quasar). Pulsar keeps working when the backend is slow or down:

1. `addTxToPool` writes the transaction to the pool (and to `localStorage`) first, with `syncStatus: 'pending-sync'` and its key in `unsyncedTxKeys`, and the tracker starts right away. `onRemoteCreate` runs in the background: when it resolves, the transaction becomes `'synced'` and the key is removed; when it rejects, the error is logged and the key stays. Reject (throw) on failure: a resolved promise counts as synced.
2. The trackers keep following the transaction in the browser, so its status stays correct without the backend. A slow backend never delays tracking, and a sync interrupted by a closed tab is still listed after the reload.
3. `reconcileUnsyncedTransactions` calls `onRemoteCreate` again for every unsynced transaction that is not already being sent: at the start of every `executeTxAction`, when an unsynced transaction reaches a terminal status, and when `createTxInMemoryStore` loads the first history page. Successful ones become `'synced'`; failed ones stay listed, also across reloads.

`onRemoteCreate` receives a copy of the transaction without `pimlicoApiKey` and `gelatoApiKey`: configure provider keys on the backend instead (for Quasar, in the app settings). `bundlerUrl` is sent, so do not put API keys in it.

To show the remote history, `createTxInMemoryStore` merges the pages returned by your `getHistory` with the local pool (terminal transactions are never overwritten by stale data, and transactions that fail validation are skipped), and `injectExternalPendingTxs` adds pending transactions from other devices to the local pool and tracks them. The complete Next.js + Quasar integration, with server actions and SIWX sessions, is in the **[Quasar transaction sync guide](https://docs.tuwa.io/guides/quasar-transaction-sync)**.

---

## 🗄️ Browser Storage

`createPulsarStore` saves its state with Zustand's `persist` middleware, by default in `localStorage`. Pass another `storage` (and other `persist` options such as `partialize` or `version`) in the same config object to change it:

| Key                          | Written by          | Content                                                                                                                                                                  |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The `name` you pass (unique) | `createPulsarStore` | `{ state, version }` where `state` is `transactionsPool` (every tracked transaction), `lastAddedTxKey` and `unsyncedTxKeys` (keys not yet confirmed by `onRemoteCreate`) |

- The state is written on every change: when a transaction is added, updated by its tracker or removed. `initialTx`, the transaction being signed, is neither saved nor restored, so a reload during signing leaves no stale signing state (pass your own `partialize` and `merge` to change that).
- In the browser the saved state is restored synchronously when the store is created, so the first client render already has the pool. Server rendering starts with an empty pool: render transaction lists on the client only. Where `localStorage` is unavailable, nothing is read or written.
- Nothing expires on its own. Transactions leave the pool only through the `maxTransactions` eviction or `removeTxFromPool`: the built-in trackers keep failed transactions as `Failed`. `store.persist.clearStorage()` deletes the saved state.
- Everything in a transaction is saved, including `payload` and, for ERC-4337, `bundlerUrl` and `pimlicoApiKey` (needed to resume tracking after a reload; a Pimlico key used in the browser is public anyway). Do not put secrets in `payload`.
- `createTxInMemoryStore` keeps its state in memory only.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[pulsar.docs.tuwa.io/packages/pulsar-core](https://pulsar.docs.tuwa.io/packages/pulsar-core)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-core/LICENSE) file for details.
