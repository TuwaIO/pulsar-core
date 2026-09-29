# Pulsar

[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)

<img src="https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/repos/pulsar_core.png" alt="Pulsar" width="400" style="border-radius: 10px; text-align: center; margin-bottom: 20px; margin-top: 20px; margin-left: auto; margin-right: auto; display: block;" />

**Pulsar** is the transaction tracking project of TUWA Stage 2: a headless, framework-agnostic engine that follows EVM and Solana transactions from the wallet prompt to their final status. It keeps transactions in a store outside your components, persists them to `localStorage`, resumes tracking after a page reload and detects EVM speed-ups and cancels made in the wallet, with no UI components and no required backend.

Pulsar is built only on modern Web3 libraries: `viem` and `@wagmi/core` for EVM, `@solana/kit` and the Wallet Standard for Solana, on top of [Orbit Utils](https://orbit.docs.tuwa.io/). It does not use `ethers.js`, `web3.js`, `@solana/web3.js` or `gill`.

📖 **Documentation:** [pulsar.docs.tuwa.io](https://pulsar.docs.tuwa.io)

---

## 🏛️ Ecosystem Layer Architecture

TUWA is built in stages. Pulsar sits in **Stage 2 (State & Connection)** next to [Satellite Connect](https://satellite.docs.tuwa.io/), above [SIWX](https://siwx.docs.tuwa.io/) and [Orbit Utils](https://orbit.docs.tuwa.io/) (Stage 1) and below [Quasar](https://sdk.docs.tuwa.io/quasar-cloud/overview) (Stage 3) and [Nova UI Kit](https://stories.tuwa.io/) (Stage 4). Nova Transactions renders Pulsar's state, and Quasar can index and sync its transactions across devices; both are optional.

Inside the monorepo, packages are split into two layers:

### Layer 3: Core (L3)

- **[`@tuwaio/pulsar-core`](./packages/pulsar-core)**: the transaction store (Zustand with `persist`), the adapter contract, metadata validation, remote sync hooks, selectors and building blocks for trackers. Peer dependencies: `@tuwaio/orbit-core`, `zustand`, `immer`, `dayjs`.

### Layer 4: Chains and React (L4)

- **[`@tuwaio/pulsar-evm`](./packages/pulsar-evm)**: the EVM adapter and trackers for standard transactions, ERC-4337 UserOperations, Safe multisig transactions and Gelato relay tasks (deprecated), plus speed-up and cancel actions. Peer dependencies: `@tuwaio/orbit-evm`, `@wagmi/core`, `viem`.
- **[`@tuwaio/pulsar-solana`](./packages/pulsar-solana)**: the Solana adapter, the signature tracker and `signAndSendSolanaTx`. Peer dependencies: `@tuwaio/orbit-solana`, `@solana/kit` (plus the `@wallet-standard` peers of `@tuwaio/orbit-solana`).
- **[`@tuwaio/pulsar-react`](./packages/pulsar-react)**: the `useInitializeTransactionsPool` hook that resumes tracking after a reload. Peer dependency: `react`.

The EVM and Solana packages have `@tuwaio/pulsar-core` as a peer dependency.

---

## 🔧 Monorepo Structure

```
pulsar-core/
├── apps/
│   └── docs/                   # pulsar.docs.tuwa.io (Next.js 16 + Nextra 4)
│       ├── src/content/        # Hand-written MDX pages + generated `packages/` reference
│       └── typedoc/            # TypeDoc plugins, Packages overview page and sidebar template
├── packages/
│   ├── pulsar-core/            # L3: transaction store, adapter contract, validation, selectors
│   ├── pulsar-evm/             # L4: EVM adapter and trackers (viem, @wagmi/core)
│   ├── pulsar-solana/          # L4: Solana adapter and tracker (@solana/kit)
│   └── pulsar-react/           # L4: React hook
└── typedoc.json                # Reference generation (TypeDoc "packages" strategy)
```

---

## 💾 Installation

Install the L3 core and the L4 packages your app needs:

```bash
# L3 Core
pnpm add @tuwaio/pulsar-core @tuwaio/orbit-core zustand immer dayjs

# L4 EVM
pnpm add @tuwaio/pulsar-evm @tuwaio/orbit-evm @wagmi/core viem

# L4 Solana
pnpm add @tuwaio/pulsar-solana @tuwaio/orbit-solana @solana/kit @wallet-standard/app @wallet-standard/ui-core @wallet-standard/ui-registry

# L4 React
pnpm add @tuwaio/pulsar-react react
```

---

## 🚀 Architectural Usage Example

A React app that tracks EVM and Solana transactions in one store. The store is created once, the initializer resumes tracking after a reload, and components read the pool with a selector:

```tsx
// store/pulsar.ts
'use client';

import { createBoundedUseStore, createPulsarStore, type Transaction } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';
import { type Config } from '@wagmi/core';
import { mainnet } from 'viem/chains';

declare const wagmiConfig: Config; // your wagmi config

export const pulsarStore = createPulsarStore<Transaction>({
  name: 'pulsar-transactions',
  adapter: [
    pulsarEvmAdapter(wagmiConfig, [mainnet]),
    pulsarSolanaAdapter({ rpcUrls: { mainnet: 'https://api.mainnet-beta.solana.com' } }),
  ],
});

export const usePulsarStore = createBoundedUseStore(pulsarStore);

// Render once, next to your providers.
export function PulsarInitializer() {
  useInitializeTransactionsPool({ initializeTransactionsPool: pulsarStore.getState().initializeTransactionsPool });
  return null;
}

export function PendingBadge() {
  const pendingCount = usePulsarStore(
    (state) => Object.values(state.transactionsPool).filter((tx) => tx.pending).length,
  );
  return pendingCount > 0 ? <span>{pendingCount} pending</span> : null;
}
```

Send transactions with `usePulsarStore((state) => state.executeTxAction)`: see the [React transaction tracking guide](https://docs.tuwa.io/guides/react-transaction-tracking) for the complete EVM and Solana flows.

---

## 🛠️ Development

```bash
pnpm install                                  # installs dependencies and builds all packages
pnpm build                                    # builds packages with tsup (ESM, CJS, types)
pnpm test                                     # runs vitest in every package
pnpm lint                                     # runs ESLint
pnpm docs:gen                                 # regenerates the Packages reference in apps/docs
pnpm --filter @tuwaio/pulsar-core-docs dev    # runs the docs site locally
```

The Packages reference is generated from each package's `src/index.ts`, JSDoc and README, and is regenerated by the pre-commit hook. Source links point to `main`, so a regeneration only changes the pages whose source actually changed. The tests of the L4 packages use the built `@tuwaio/pulsar-core`: run `pnpm build` after changing it.

---

## 🤝 Contribution & Auditing

Please review our ecosystem **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
