# Pulsar Solana Adapter & Toolkit

[](https://www.npmjs.com/package/@tuwaio/pulsar-solana)
[](https://www.google.com/search?q=./LICENSE)
[](https://github.com/TuwaIO/pulsar-core/actions)

An advanced toolkit for the Pulsar Engine that adds comprehensive support for tracking transactions on the Solana blockchain. It integrates seamlessly with **`@solana/kit`** and the **`@solana/wallet-adapter-react`** ecosystem.

-----

## 🏛️ What is `@tuwaio/pulsar-solana`?

This package is a powerful, official adapter for `@tuwaio/pulsar-core`. It contains all the necessary logic to interact with the Solana blockchain, acting as the primary logic provider for Solana-based dApps using Pulsar.

While its main export is the `solanaAdapter`, it also includes a suite of standalone trackers and utilities that can be used for advanced or custom implementations. The architecture is designed for robustness, ensuring transactions can be tracked even after a page reload by storing the relevant RPC endpoint within each transaction object.

-----

## ✨ Core Features

- **🔌 Simple Integration:** A single `solanaAdapter` factory function to easily plug full Solana support into `@tuwaio/pulsar-core`.
- **🛰️ Robust Polling Tracker:** A durable transaction tracker that polls for signature statuses until finality, built on Pulsar's generic polling utility.
- **🔗 RPC Persistence:** The tracker is designed to be self-contained, storing the `rpcUrl` within each transaction to guarantee tracking can resume after page reloads, independent of the current wallet connection.
- **🌐 Network Verification:** Includes a utility (`checkSolanaChain`) to robustly verify the connected network via its genesis hash, preventing transactions from being sent to the wrong cluster.
- **👤 Name Service Support:** Built-in support for **Solana Name Service (SNS)** via Bonfida, allowing for easy resolution of `.sol` domain names and associated avatars.
- **🛠️ Utility Suite:** Exports a rich set of helpers, including the SNS resolvers (`getSolanaName`, `getSolanaAvatar`) and an explorer link generator (`selectSolanaTxExplorerLink`).

-----

## 💾 Installation

This package is designed for use in a React environment with `@solana/wallet-adapter-react` and requires `@solana/kit`. Install all necessary packages together:

```bash
# Using pnpm
pnpm add @tuwaio/pulsar-solana @tuwaio/pulsar-core @solana/kit @solana/wallet-adapter-react zustand immer

# Using npm
npm install @tuwaio/pulsar-solana @tuwaio/pulsar-core @solana/kit @solana/wallet-adapter-react zustand immer

# Using yarn
yarn add @tuwaio/pulsar-solana @tuwaio/pulsar-core @solana/kit @solana/wallet-adapter-react zustand immer
```

-----

## 🚀 Usage

### 1\. Primary Usage: The `solanaAdapter`

For most applications, you'll need to import the `solanaAdapter` and pass it to your `createPulsarStore` configuration. The adapter should be initialized within a React component to access the necessary hooks from `@solana/wallet-adapter-react`.

```tsx
// src/store/pulsarStore.ts
import { createPulsarStore } from '@tuwaio/pulsar-core';
import { solanaAdapter } from '@tuwaio/pulsar-solana';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

// It's best to create the store instance via a hook to access wallet/connection hooks.
export const useMyPulsarStore = () => {
  const wallet = useWallet();
  const connection = useConnection();

  // useMemo ensures the store is created only once.
  return useMemo(() => {
    return createPulsarStore({
      // A unique name for localStorage persistence
      name: 'my-solana-dapp-transactions',
      // Provide the solanaAdapter with the hook contexts
      adapters: [solanaAdapter({ wallet, connection })],
      // Optional: Add global callbacks for all successful transactions
      onSucceedCallbacks: (tx) => {
        console.log(`Transaction ${tx.txKey} succeeded!`);
      },
    });
  }, [wallet, connection]);
};
```

### 2\. Initiating a Transaction

When calling `handleTransaction`, you must now provide the `rpcUrl` for the transaction. This ensures the tracker can function correctly even after a page reload.

```tsx
// src/components/MyTransactionButton.tsx
import { usePulsar } from '@tuwaio/pulsar-react'; // Or your custom hook
import { useConnection } from '@solana/wallet-adapter-react';
import { TransactionAdapter } from '@tuwaio/pulsar-core';

// An example action that returns a transaction signature
async function mySolanaAction(): Promise<string> {
  // ... your logic to build and send a transaction ...
  const signature = await sendTransaction(...);
  return signature;
}

function MyTransactionButton() {
  const { handleTransaction } = usePulsar();
  const { connection } = useConnection();

  const handleClick = async () => {
    await handleTransaction({
      actionFunction: () => mySolanaAction(),
      params: {
        adapter: TransactionAdapter.SOLANA,
        // The RPC endpoint must be provided for tracking.
        rpcUrl: connection.rpcEndpoint,
        desiredChainID: 'mainnet-beta', // The cluster name for the pre-flight check
        type: 'MY_ACTION',
        title: 'My Action',
        description: 'Executing my custom action.',
      },
    });
  };

  return <button onClick={handleClick}>Execute Action</button>;
}
```

### 3\. Using Standalone Utilities

You can use exported utilities, like the SNS resolvers, to enrich your UI.

**Example: Displaying a user's .sol domain name**

```tsx
// src/components/DisplayName.tsx
import { getSolanaName } from '@tuwaio/pulsar-solana';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

function DisplayName() {
  const { publicKey } = useWallet();
  const connection = useConnection();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey && connection) {
      getSolanaName(connection, publicKey.toBase58()).then(setName);
    }
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return <span>{name || publicKey.toBase58()}</span>;
}
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.