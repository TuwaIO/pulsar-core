# Pulsar Solana Adapter & Toolkit

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-solana.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-solana)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-solana.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

Layer 4 (L4) of the TUWA Ecosystem. Low-level Solana block state monitors and RPC cluster lifecycle indexers powered strictly by gill.

---

## 🏛️ What is `@tuwaio/pulsar-solana`?

This package is the low-level Solana block state monitor and RPC cluster lifecycle indexing adapter for `@tuwaio/pulsar-core`. It leverages **Wallet Standard** for deep integration with modern Solana wallet environments, performing fast-block signature status tracking, signature swap detection, and cluster manager alignment using `gill` primitives.

The architecture is designed for multi-chain robustness. You can provide RPC endpoints for different Solana clusters (e.g., Mainnet Beta, Devnet), and the adapter will automatically use the correct one based on the user's connected wallet state.

---

## ✨ Core Features

- **🔌 Wallet Standard Integration:** A single `pulsarSolanaAdapter` factory that interfaces with any wallet conforming to the **Wallet Standard**.
- **🔗 Multi-Chain RPC:** Configuration mapping for RPC endpoints across multiple Solana clusters (mainnet-beta, devnet, testnet).
- **🛰️ Signature Swap & Status Tracker:** A high-speed transaction signature monitor that checks RPC node block states and tracks signature mutations.
- **🌐 Cluster Verification:** Includes a pre-flight validator (`checkSolanaChain`) to ensure the connected wallet's cluster matches the transaction's target network.
- **💡 Read-Only Operations:** The adapter can initialize without wallet contexts to fetch and parse histories.

---

## 💾 Installation

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/pulsar-solana @tuwaio/pulsar-core gill @tuwaio/orbit-core @tuwaio/orbit-solana zustand immer dayjs @wallet-standard/app @wallet-standard/ui-registry @wallet-standard/ui-core
```

---

## 🚀 Usage

### 1. Primary Usage: Integrating with `@tuwaio/nova-connect`

The key to using Pulsar with Solana is to leverage the `pulsarSolanaAdapter`, which seamlessly integrates with the `@tuwaio/nova-connect` state. This removes the need for manual wallet state management, as the adapter automatically reacts to changes in the active wallet, cluster, and connection status via **Wallet Standard** interfaces.

**Example: Creating a Pulsar Store**
Here's how to create and initialize the central Pulsar store using the `pulsarSolanaAdapter`.

```typescript
// src/hooks/pulsarStoreHook.ts

import { createBoundedUseStore, createPulsarStore } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';

// 2. Define a typed transaction for the 'example' action
type ExampleTx = Transaction & {
  type: 'example';
  payload: {
    value: number; // Example payload: the new value
  };
};

// Create a union of all possible transaction types
export type TransactionUnion = ExampleTx;

const storageName = 'transactions-tracking-storage';

export const solanaRPCUrls = {
  devnet: 'https://api.devnet.solana.com',
};

export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionUnion>({
    name: storageName,
    adapter: [
      pulsarSolanaAdapter({
        rpcUrls: solanaRPCUrls,
      }),
    ],
    beforeTxProcess: async () => {
      // Optional global preflight. Throw here to block before wallet interaction.
      await assertUserCanSubmitTransactions();
    },
  }),
);
```

`@tuwaio/pulsar-core` validates Solana transaction metadata before any wallet interaction or persistence. `title` strings are limited to 100 characters, `description` strings to 300 characters, and the serialized `payload` to 10KB. A local `beforeTxProcess` passed to `executeTxAction` overrides the global callback from `createPulsarStore`.

---

### 2. Initiating a Transaction

When calling `executeTxAction`, Pulsar automatically fetches the necessary `wallet` and `client` instances based on the connected wallet. Your action function then receives these objects as parameters, allowing you to focus purely on building and sending the transaction.

```tsx
// src/components/MyTransactionButton.tsx
import { UiWalletAccount } from '@wallet-standard/react';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { useSatelliteConnectStore } from '@tuwaio/nova-connect/satellite';
// The action function receives the wallet and client from the adapter.
import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';
import { Address, SolanaClient, TransactionSendingSigner } from 'gill';
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { Wallet } from '@tuwaio/nova-connect/satellite';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createSolanaClientWithCache } from '@tuwaio/orbit-solana';
import { SolanaConnection } from '@tuwaio/satellite-solana';

import { usePulsarStore } from '@/hooks/pulsarStoreHook';

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
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);

  const activeWalletSolana = activeConnection as SolanaConnection;

  const signer = useWalletAccountTransactionSendingSigner(
    activeWalletSolana.connectedAccount as UiWalletAccount,
    `${OrbitAdapter.SOLANA}:${activeConnection?.chainId ?? 'devnet'}`,
  );

  const handleClick = async () => {
    await executeTxAction({
      actionFunction: () =>
        myAction({
          client: createSolanaClientWithCache({ rpcUrlOrMoniker: 'devnet' }),
          signer,
        }),
      onSuccess: async () => {
        console.log('action executed')
      },
      beforeTxProcess: async () => {
        await assertSolanaActionsEnabled();
      },
      params: {
        type: 'example',
        adapter: OrbitAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: activeConnection?.rpcURL,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: 'Example',
        description: 'Example tx',
      },
    });
  };

  return <button onClick={handleClick}>Execute Action</button>;
}
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
