# @tuwaio/pulsar-react

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-react.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-react)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-react.svg)](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/LICENSE)

`@tuwaio/pulsar-react` is the React Layer 4 (L4) package of **Pulsar**, the transaction tracking project of TUWA Stage 2 ("State & Connection", next to Satellite Connect). Built on **`react`** only, it ships one hook, `useInitializeTransactionsPool`, that restarts the trackers of pending transactions when your app mounts. It has no UI components and no dependency on the other Pulsar packages: to read the store in components, use `createBoundedUseStore` from [`@tuwaio/pulsar-core`](https://pulsar.docs.tuwa.io/packages/pulsar-core).

---

## 🏛️ Core Capabilities

- **Resume after reload:** `useInitializeTransactionsPool` calls the store's `initializeTransactionsPool` in an effect, on the client and after the store has restored its pool from `localStorage`, so transactions that were pending before a reload are tracked again.
- **Runs once:** the effect depends only on `initializeTransactionsPool`, and the latest `onError` is read without re-running it, so an inline `onError` does not start new trackers on every render.
- **Errors:** a rejected initialization goes to `onError`, or to `console.error` by default; nothing is reported after unmount.

---

## 💾 Installation

```bash
pnpm add @tuwaio/pulsar-react react
```

> [!IMPORTANT]
> `react` (>=19.2.3) is a peer dependency and must be installed alongside `@tuwaio/pulsar-react`. The hook is used with a store from [`@tuwaio/pulsar-core`](https://pulsar.docs.tuwa.io/packages/pulsar-core).

---

## 🚀 Usage

Render the initializer once, in a component that stays mounted, such as your root providers:

```tsx
'use client';

import { createPulsarStore, type Transaction, type TxAdapter } from '@tuwaio/pulsar-core';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';

declare const adapter: TxAdapter<Transaction>; // pulsarEvmAdapter(...) or pulsarSolanaAdapter(...)

export const pulsarStore = createPulsarStore<Transaction>({ name: 'pulsar-transactions', adapter });

export function PulsarInitializer() {
  useInitializeTransactionsPool({
    initializeTransactionsPool: pulsarStore.getState().initializeTransactionsPool,
    onError: (error) => console.warn('Could not resume transaction tracking:', error),
  });

  return null;
}
```

Every call of `initializeTransactionsPool` starts new trackers, so do not render the initializer more than once. In development, React Strict Mode runs effects twice. The complete setup is on the **[Getting Started](https://pulsar.docs.tuwa.io/gettingStarted)** page.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[pulsar.docs.tuwa.io/packages/pulsar-react](https://pulsar.docs.tuwa.io/packages/pulsar-react)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-react/LICENSE) file for details.
