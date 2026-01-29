# Pulsar Solana Adapter & Toolkit

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-solana.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-solana)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-solana.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

An advanced toolkit for the Pulsar Engine that adds comprehensive support for tracking transactions on the Solana blockchain. It is built to leverage **Wallet Standard**, integrating seamlessly with modern Solana wallet ecosystems, and uses **`gill`** for modern blockchain interaction.

-----

## 🏛️ What is `@tuwaio/pulsar-solana`?

This package is a powerful, official adapter for `@tuwaio/pulsar-core`. It's designed to be compatible with wallets that follow the **Wallet Standard**. By leveraging standard wallet interfaces, you can utilize Pulsar's powerful transaction tracking engine across a wide range of Solana wallets.

The architecture is designed for multi-chain robustness. You can provide RPC endpoints for different Solana clusters (e.g., Mainnet Beta, Devnet), and the adapter will automatically use the correct one based on the user's connected wallet state.

-----

## ✨ Core Features

- **🔌 Wallet Standard Integration:** A single `pulsarSolanaAdapter` factory that works with any wallet supporting the **Wallet Standard**.
- **🔗 Multi-Chain RPC:** Configure with a map of RPC URLs for different clusters; the adapter intelligently selects the correct one.
- **🛰️ Robust Polling Tracker:** A durable transaction tracker that polls for signature statuses until finality.
- **🌐 Network Verification:** Includes a utility (`checkSolanaChain`) to verify that the connected wallet's cluster matches the one required by the transaction.
- **💡 Optional Wallet:** The adapter can be initialized without a wallet for read-only operations, such as displaying transaction history.

-----

## 💾 Installation

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/pulsar-solana @tuwaio/pulsar-core gill @tuwaio/orbit-core @tuwaio/orbit-solana zustand immer dayjs @wallet-standard/app @wallet-standard/ui-registry @wallet-standard/ui-core
```

-----

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
  }),
);
```

-----

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
import { SolanaWallet } from '@tuwaio/satellite-solana';

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

  const activeWalletSolana = activeConnection as SolanaWallet;

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

-----

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.