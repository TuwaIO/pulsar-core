# Pulsar React

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-react.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-react)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-react.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Tuwaio/pulsar-core/main.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

Official React bindings for the Pulsar Engine. This package currently provides the essential **`useInitializeTransactionsPool`** hook to resume tracking pending transactions after a page reload.

## 🏛️ Architecture

This package acts as a lightweight connector between the framework-agnostic Pulsar engine and a React application. It helps integrate Pulsar's state with the React component lifecycle.

---

## 💾 Installation

To use this package, you need the core Pulsar stack.

```bash
pnpm add @tuwaio/pulsar-react @tuwaio/pulsar-core @tuwaio/pulsar-evm
```

---

## 🚀 Getting Started

The `useInitializeTransactionsPool` hook is designed to be called once when your application loads. It requires the `initializeTransactionsPool` function, which is provided by the main Pulsar store.

Here is a complete example of the recommended setup:

### Step 1: Create Your `usePulsar` Hook

In your application, create a custom hook to access the Pulsar store, which is created by a function from `@tuwaio/pulsar-core`.

```tsx
// hooks/usePulsar.ts
import { createBoundedUseStore, createPulsarStore } from '@tuwaio/pulsar-core';

export const usePulsar = createBoundedUseStore(
  createPulsarStore({
    name: 'pulsar-storage',
    // Plug in the EVM adapter with its config for example
    adapters: [
      evmAdapter(wagmiConfig, [mainnet, sepolia]),
    ],
    // ... other configurations
  }),
);
```

### Step 2: Create an Initializer Component

Create a small, client-side component that uses the hook from this package to initialize the store.

```tsx
// components/TransactionInitializer.tsx
'use client';

import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { usePulsar } from '../hooks/usePulsar';

export const TransactionInitializer = () => {
  // 1. Get the initialization function from the core store hook
  const { initializeTransactionsPool } = usePulsar();

  // 2. Pass it to the hook from this package to run on mount
  useInitializeTransactionsPool(initializeTransactionsPool);

  return null; // This component renders nothing
};
```

### Step 3: Add the Initializer to Your App

Place the `TransactionInitializer` component at a high level in your application tree so it runs on every page load.

```tsx
// app/layout.tsx or app/providers.tsx
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { wagmiConfig } from './wagmi';
import { TransactionInitializer } from '../components/TransactionInitializer';

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TransactionInitializer />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

## 📖 API: `useInitializeTransactionsPool`

This is the only hook exported by this package. Its purpose is to re-initialize the transaction store on page load.

### Parameters
-   `initializeTransactionsPool`: The initialization function obtained from your `usePulsar` hook.
-   `customErrorHandler?`: (Optional) A callback function to handle any errors during initialization.

---

## 🤝 Contributing

As this package grows, contributions will be welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

This project is licensed under the **Apache-2.0 License**.