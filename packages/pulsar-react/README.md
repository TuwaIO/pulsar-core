# Pulsar React

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-react.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-react)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-react.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

Official React bindings for the Pulsar Engine. This package provides the essential **`useInitializeTransactionsPool`** hook to seamlessly integrate Pulsar's state with your application's lifecycle.

---

## 🏛️ What is `@tuwaio/pulsar-react`?

This package is the official bridge between the framework-agnostic `@tuwaio/pulsar-core` and a React application. It provides hooks and utilities that simplify the process of connecting Pulsar's state management to the React component lifecycle.

Its primary role is to ensure that transaction tracking can resume reliably after a page reload.

---

## 💾 Installation

To use this package, you need the complete Pulsar stack, including `@wagmi/core` for EVM interactions.

```bash
# Using pnpm
pnpm add @tuwaio/pulsar-react react

# Using npm
npm install @tuwaio/pulsar-react react

# Using yarn
yarn add @tuwaio/pulsar-react react
```

---

## 🚀 Getting Started

The recommended way to integrate Pulsar with React is to create a vanilla store instance, create a bounded hook for it, and then use `useInitializeTransactionsPool` in your main layout component.

Here is a complete step-by-step example:

### Step 1: Create the Pulsar Store and Hook

First, create your vanilla Pulsar store and a reusable, bounded hook to access it. This pattern is recommended by Zustand for type safety and ease of use.

```ts
// src/hooks/txTrackingHooks.ts
import { createBoundedUseStore, createPulsarStore, Transaction } from '@tuwaio/pulsar-core';
import { evmAdapter } from '@tuwaio/pulsar-evm';

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
    adapter: evmAdapter(config, appChains),
  }),
);
```

### Step 2: Initialize the Store in Your App

Create a small, client-side component that uses the `useInitializeTransactionsPool` hook. This component's job is to re-activate trackers for pending transactions when the app loads.

```tsx
// src/components/PulsarInitializer.tsx
'use client';

import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { usePulsarStore } from '../hooks/txTrackingHooks';

export const PulsarInitializer = () => {
  // Get the initialization function from the store via our custom hook
  const initializeTransactionsPool = usePulsar((state) => state.initializeTransactionsPool);

  // Pass the function to the hook from this package
  useInitializeTransactionsPool({ initializeTransactionsPool });

  return null; // This component renders nothing to the DOM
};
```

### Step 3: Add the Initializer to Your Root Layout

Finally, place the `PulsarInitializer` component at a high level in your application tree (e.g., in your root layout or providers component) so it runs on every page load.

```tsx
// src/app/layout.tsx (Next.js example)
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../configs/wagmi';
import { PulsarInitializer } from '../components/PulsarInitializer';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <PulsarInitializer />
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
```

With this setup, your application is now fully configured to track transactions and resume tracking across page reloads.

---

## 📖 API Reference

### `useInitializeTransactionsPool(params)`

This is the primary hook exported by this package. Its sole purpose is to re-initialize the transaction store on component mount.

#### **Parameters**

The hook accepts a single object with the following properties:

- `initializeTransactionsPool: () => Promise<void>`: **(Required)** The initialization function obtained from your Pulsar store.
- `onError?: (error: Error) => void`: **(Optional)** A callback function to handle any errors that occur during initialization. If not provided, errors will be logged to the console.

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
