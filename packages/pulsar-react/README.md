# Pulsar React

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-react.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-react)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-react.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/main.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

Official React bindings for the Pulsar Engine. This package currently provides the essential `useInitializeTransactionsPool` hook to resume tracking pending transactions after a page reload.

## 🏛️ Architecture

This package acts as a lightweight connector between the framework-agnostic Pulsar engine and a React application. It helps integrate Pulsar's state with the React component lifecycle.

## 💾 Installation

To use this package, you need the core Pulsar stack.

```bash
pnpm add @tuwaio/pulsar-react @tuwaio/pulsar-core @tuwaio/pulsar-evm
```

## 🚀 Getting Started

The setup process involves three main steps: creating a custom hook for your store, creating a component to initialize it, and placing that component in your application tree.

### Step 1: Create Your `usePulsar` Hook

In your application (e.g., in a `store/` or `hooks/` directory), create a custom `usePulsar` hook. This is done by calling `createPulsarStore` with your project's configuration and wrapping it with `createBoundedUseStore`.

```tsx
// hooks/usePulsar.ts
import { createBoundedUseStore, createPulsarStore } from '@tuwaio/pulsar-core';
import { appChains } from './wagmi';
import { onSucceedCallbacks } from './onSucceedCallbacks';

// Define your custom transaction types if any
// type TransactionUnion = ...;

export const usePulsar = createBoundedUseStore(
  createPulsarStore<TransactionUnion>({
    name: 'pulsar-storage',
    appChains,
    onSucceedCallbacks,
  }),
);
```

### Step 2: Create an Initializer Component

Create a small, client-side component whose only job is to call the initialization hook.

```tsx
// components/TransactionInitializer.tsx
'use client';

import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { usePulsar } from '../hooks/usePulsar';

export const TransactionInitializer = () => {
  // Get the initialization function from your custom hook
  const { initializeTransactionsPool } = usePulsar();

  // Pass it to the hook from this package to run on mount
  useInitializeTransactionsPool(initializeTransactionsPool);

  return null; // This component renders nothing
};
```

### Step 3: Add the Initializer to Your App Layout

Finally, place the `TransactionInitializer` component at a high level in your application, for example, in your root providers file.

```tsx
// app/providers.tsx
'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './wagmi';
import { TransactionInitializer } from '../components/TransactionInitializer';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
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

## API: `useInitializeTransactionsPool`

This is the primary hook exported by this package. Its sole purpose is to re-initialize the transaction store on page load.

### Parameters
-   `initializeTransactionsPool`: The initialization function obtained from your custom `usePulsar` hook.
-   `customErrorHandler?`: (Optional) A callback function to handle any errors during initialization.

## 🤝 Contributing

As this package grows, contributions will be welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

This project is licensed under the **Apache-2.0 License**.