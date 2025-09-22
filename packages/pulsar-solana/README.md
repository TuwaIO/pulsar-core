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
pnpm add @tuwaio/pulsar-solana @tuwaio/pulsar-core gill @bonfida/spl-name-service @solana/web3.js zustand immer dayjs

# Using npm
npm install @tuwaio/pulsar-solana @tuwaio/pulsar-core gill @bonfida/spl-name-service @solana/web3.js zustand immer dayjs

# Using yarn
yarn add @tuwaio/pulsar-solana @tuwaio/pulsar-core gill @bonfida/spl-name-service @solana/web3.js zustand immer dayjs
```

-----

## 🚀 Usage

### 1. Primary Usage: Integrating with `@wallet-ui/react`

The key to using Pulsar with Solana is to leverage the `solanaAdapter`, which seamlessly integrates with the `@wallet-ui/react` state. This removes the need for manual wallet state management, as the adapter automatically reacts to changes in the active wallet, cluster, and connection status.

**Example: Creating a Pulsar Store**
Here's how to create and initialize the central Pulsar store using the `solanaAdapter`. The adapter subscribes to state changes from `@wallet-ui/react`, keeping the transaction pool in sync with your dApp's wallet.

```typescript
// src/providers/PulsarProvider.ts
import { createPulsarStore, Transaction } from '@tuwaio/pulsar-core';
import { solanaAdapter } from '@tuwaio/pulsar-solana';
import { useWalletUi } from '@wallet-ui/react';
import { PropsWithChildren, useMemo } from 'react';

type PulsarStore = ITxTrackingStore<TransactionUnion>;
const PulsarStoreContext = createContext<StoreApi<PulsarStore> | null>(null);

const storageName = 'transactions-tracking-storage';

// 2. Define a typed transaction for the 'example' action
type ExampleTx = Transaction & {
  type: 'example';
  payload: {
    value: number; // Example payload: the new value
  };
};

// Create a union of all possible transaction types
export type TransactionUnion = ExampleTx;

export function PulsarProvider({ children }: PropsWithChildren) {
  const wallet = useWalletUi();

  const store = useMemo(() => {
    return createPulsarStore<TransactionUnion>({
      name: storageName,
      adapter: solanaAdapter({
        wallet: {
          walletAddress: wallet?.account?.address.toString() ?? '',
          walletType: wallet?.account?.label ?? 'solana',
          walletActiveChain: wallet?.cluster.cluster ?? 'mainnet',
        },
        rpcUrls: {
          devnet: 'https://api.devnet.solana.com',
        },
      }),
    });
  }, [wallet]);

  return <PulsarStoreContext.Provider value={store}>{children}</PulsarStoreContext.Provider>;
}

export const usePulsarStore = <T>(selector: (state: PulsarStore) => T): T => {
  const store = useContext(PulsarStoreContext);
  if (!store) {
    throw new Error('usePulsarStore must be used within a PulsarProvider');
  }
  return useStore(store, selector);
};
````

-----

### 2. Initiating a Transaction

When calling `handleTransaction`, Pulsar automatically fetches the necessary `wallet` and `client` instances from the store based on the active wallet in `@wallet-ui/react`. Your action function then receives these objects as parameters, allowing you to focus purely on building and sending the transaction.

```tsx
// src/components/MyTransactionButton.tsx
import { useWalletUi, useWalletAccountTransactionSendingSigner, UiWalletAccount } from '@wallet-ui/react';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
// The action function receives the wallet and client from the adapter.
import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';
import { Address, SolanaClient, TransactionSendingSigner } from 'gill';

import { usePulsarStore } from '@/providers/PulsarProvider';

export function myAction({ client, signer }: {
  client: SolanaClient;
  signer: TransactionSendingSigner;
}) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: [...your instructions...],
  });
}

function MyTransactionButton() {
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const walletUi = useWalletUi();

  const signer = useWalletAccountTransactionSendingSigner(walletUi.account as UiWalletAccount, walletUi.cluster.id);

  const handleClick = async () => {
    if (!walletUi.connected) {
        // Handle wallet not connected
        return;
    }
    await handleTransaction({
      actionFunction: () => myAction({ client: walletUi.client, signer }),
      onSuccessCallback: async () => {
        console.log('Executed')
      },
      params: {
        type: 'myAction',
        adapter: TransactionAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: walletUi.cluster.urlOrMoniker,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
      },
    });
  };

  return <button onClick={handleClick}>Execute Action</button>;
}
```

-----

### 3. Using Standalone Utilities

You can use the helper functions, such as `getSolanaExplorerLink` and `checkSolanaChain`, independently of the Pulsar store. These utilities are particularly useful for enhancing UI components and performing pre-transaction checks.

**Example: Displaying a user's Solana explorer link**

```tsx
// src/components/ExplorerLink.tsx
import { getSolanaExplorerLink } from '@tuwaio/pulsar-solana';
import { useWalletUi } from '@wallet-ui/react';

function ExplorerLink({ txSignature }: { txSignature: string }) {
  const { cluster } = useWalletUi();

  // Use the cluster from the global state to generate the correct link.
  const explorerUrl = getSolanaExplorerLink(`/tx/${txSignature}`, cluster.cluster);

  return (
    <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
      View on Explorer
    </a>
  );
}
```

-----

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.