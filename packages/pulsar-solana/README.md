# Pulsar Solana Adapter & Toolkit

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-solana.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-solana)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-solana.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

An advanced toolkit for the Pulsar Engine that adds comprehensive support for tracking transactions on the Solana blockchain. It is built to be **wallet-library agnostic**, integrating with any setup via a simple configuration object, and uses **`gill-sdk`** for modern blockchain interaction.

-----

## 🏛️ What is `@tuwaio/pulsar-solana`?

This package is a powerful, official adapter for `@tuwaio/pulsar-core`. It's designed to be universally compatible with any wallet connection library. By providing a simple wallet state object, you can leverage Pulsar's powerful transaction tracking engine without being locked into a specific ecosystem like the Wallet Standard.

The architecture is designed for multi-chain robustness. You can provide RPC endpoints for different Solana clusters (e.g., Mainnet Beta, Devnet), and the adapter will automatically use the correct one based on the user's connected wallet state.

-----

## ✨ Core Features

- **🔌 Universal Integration:** A single `solanaAdapter` factory that works with **any wallet library**.
- **🔗 Multi-Chain RPC:** Configure with a map of RPC URLs for different clusters; the adapter intelligently selects the correct one.
- **🛰️ Robust Polling Tracker:** A durable transaction tracker that polls for signature statuses until finality.
- **🌐 Network Verification:** Includes a utility (`checkSolanaChain`) to robustly verify that the connected wallet's cluster matches the one required by the transaction.
- **👤 Name Service Support:** Built-in support for **Solana Name Service (SNS)** on the currently active network.
- **💡 Optional Wallet:** The adapter can be initialized without a wallet for read-only operations, such as displaying transaction history.

-----

## 💾 Installation

The package has minimal dependencies, requiring only `gill-sdk` for core functionality.

```bash
# Using pnpm
pnpm add @tuwaio/pulsar-solana @tuwaio/pulsar-core gill zustand immer

# Using npm
npm install @tuwaio/pulsar-solana @tuwaio/pulsar-core gill zustand immer

# Using yarn
yarn add @tuwaio/pulsar-solana @tuwaio/pulsar-core gill zustand immer
```

-----

## 🚀 Usage

### 1\. Primary Usage: The `solanaAdapter`

The key is to construct a simple `wallet` object from your chosen wallet library and pass it to the adapter's configuration. This object acts as a bridge, telling Pulsar the current state of the user's wallet.

**Example with `@solana/wallet-adapter-react`:**

```typescript
// src/store/pulsarStore.ts
import { createPulsarStore } from '@tuwaio/pulsar-core';
import { solanaAdapter, SolanaAdapterWallet } from '@tuwaio/pulsar-solana';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

// This hook creates a Pulsar store instance that is memoized and updates
// reactively when the wallet's state changes.
export const useMyPulsarStore = () => {
  const { publicKey, wallet } = useWallet();
  const walletAdapter = useWallet();

  // 1. Create the simple wallet object required by the adapter.
  const pulsarWallet: SolanaAdapterWallet | undefined = useMemo(() => {
    if (!publicKey || !wallet) return undefined;

    return {
      walletAddress: publicKey.toBase58(),
      walletType: wallet.adapter.name.toLowerCase(),
      // You must determine the active cluster, e.g., from your app's state.
      walletActiveChain: 'mainnet',
    };
  }, [publicKey, wallet]);

  // 2. Create the Pulsar store.
  return useMemo(() => {
    return createPulsarStore({
      name: 'my-solana-dapp-transactions',
      adapters: [
        solanaAdapter({
          // The wallet object can be undefined if no wallet is connected.
          wallet: pulsarWallet,
          rpcUrls: {
            'mainnet': 'https://api.mainnet-beta.solana.com',
            'devnet': 'https://api.devnet.solana.com',
          },
        }),
      ],
      // 3. Register your transaction actions. These will receive the raw wallet
      // object for signing.
      actions: {
        myAction: (params: { walletAdapter: any; rpc: any; }) => mySolanaAction(params)
      }
    });
  }, [pulsarWallet]);
};
```

### 2\. Initiating a Transaction

When calling `handleTransaction`, provide the `desiredChainId` with the **cluster moniker** (e.g., `'mainnet'`). Your `actionFunction` (registered in the store) is now fully responsible for signing and sending the transaction using the raw wallet object passed in the payload.

```tsx
// src/components/MyTransactionButton.tsx
import { usePulsar } from '@tuwaio/pulsar-react';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { useWallet } from '@solana/wallet-adapter-react'; // Your chosen wallet library

// The action function receives the raw wallet instance and an RPC client.
// It must handle the entire transaction creation and sending process.
async function mySolanaAction({ walletAdapter, rpc }): Promise<string> {
  // `walletAdapter` is the original instance from your wallet library.
  const { sendTransaction } = walletAdapter;
  
  // ... your logic to build the transaction ...
  const signature = await sendTransaction(transaction, rpc.connection);
  return signature;
}

function MyTransactionButton() {
  const { handleTransaction } = usePulsar();
  const walletAdapter = useWallet(); // Get the raw wallet object

  const handleClick = async () => {
    if (!walletAdapter.connected) {
        // Handle wallet not connected
        return;
    }
    await handleTransaction({
      // The key for your action, which is registered in the store config.
      actionKey: 'myAction',
      params: {
        adapter: TransactionAdapter.SOLANA,
        rpcUrl: connection.connection.rpcEndpoint,
        desiredChainId: 'mainnet',
        type: 'MY_ACTION',
        title: 'My Action',
      },
    });
  };

  return <button onClick={handleClick}>Execute Action</button>;
}
```

### 3\. Using Standalone Utilities

You can use exported utilities, like the SNS resolvers, to enrich your UI. These utilities need an RPC URL, which should ideally be sourced from your central configuration.

**Example: Displaying a user's .sol domain name**

```tsx
// src/components/DisplayName.tsx
import { getSolanaName } from '@tuwaio/pulsar-solana';
import { useEffect, useState } from 'react';

// Assume you have access to the wallet address and the appropriate RPC URL
function DisplayName({ address, rpcUrl }: { address: string; rpcUrl: string }) {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (address && rpcUrl) {
      getSolanaName(rpcUrl, address).then(setName);
    }
  }, [address, rpcUrl]);

  if (!address) return null;

  return <span>{name || address}</span>;
}
```

-----

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.