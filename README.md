# Pulsar Engine

[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-core.svg)](./LICENSE)
[![Contributors](https://img.shields.io/github/contributors/TuwaIO/pulsar-core)](https://github.com/TuwaIO/pulsar-core/graphs/contributors)

<img src="https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/repos/pulsar_core.png" alt="Pulsar Core" width="400" style="border-radius: 10px; text-align: center; margin-bottom: 20px; margin-top: 20px; margin-left: auto; margin-right: auto; display: block;" />

Welcome to the official monorepo for **Pulsar**, a headless, local-first transaction lifecycle tracking engine for the TUWA Ecosystem.

---

## 🏛️ Architecture Philosophy

Pulsar is "The Tracker" within the ecosystem, occupying Tier 3 (Headless Core Store) and Tier 4 (Network State Adapters & Framework Bindings). Its single purpose is asynchronous multi-chain transaction lifecycle indexing and client-side reconciliation.

It is designed to be consumed by any UI layer, with our official implementation being the **[Nova UI Kit](https://github.com/TuwaIO/nova-uikit)**.

The architecture is modular and layered:

- 🧠 **Core (`@tuwaio/pulsar-core`):** A framework-agnostic state machine that knows _how_ to manage state but nothing about specific blockchains.
- 🔌 **Adapters (`@tuwaio/pulsar-evm`, `@tuwaio/pulsar-solana`):** Platform-specific modules that plug into the core. They teach Pulsar _how_ to interact with specific ecosystems like EVM or Solana.
- ⚛️ **Bindings (`@tuwaio/pulsar-react`):** Framework-specific packages that provide hooks and utilities to easily connect Pulsar to a UI framework's lifecycle.

---

## ✨ Key Features

- **Framework-Agnostic Core:** Framework-agnostic headless core store providing append-only localStorage transaction history ledgers.
- **Multi-Chain by Design:** The adapter pattern allows for extending support to any blockchain.
- **Persistent State:** Automatically resumes tracking pending transactions after a page reload.
- **Rich Ecosystem Support:**
  - **EVM Adapter:** Supports standard transactions, Safe multisigs, and Gelato relay.
  - **Solana Adapter:** Supports Wallet Standard, cluster management, and transaction tracking.
- **Type-Safe:** Written entirely in TypeScript to ensure a robust developer experience.

---

## 📦 Packages

This repository is a monorepo managed using `pnpm` workspaces.

| Package                        | Version                                                                                                                       | Description                                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 🧠 **`@tuwaio/pulsar-core`**   | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-core.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-core)     | Tier 3 of the TUWA Ecosystem. Framework-agnostic headless core store providing append-only localStorage transaction history ledgers. |
| 🔌 **`@tuwaio/pulsar-evm`**    | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-evm.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-evm)       | Tier 4 of the TUWA Ecosystem. Low-level EVM state trackers and lifecycle indexers powered strictly by viem and wagmi primitives.     |
| 🔌 **`@tuwaio/pulsar-solana`** | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-solana.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-solana) | Tier 4 of the TUWA Ecosystem. Low-level Solana block state monitors and RPC cluster lifecycle indexers powered strictly by gill.     |
| ⚛️ **`@tuwaio/pulsar-react`**  | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-react.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-react)   | Global React context bindings, hooks, and transaction pool initializers for orchestrating framework-agnostic Pulsar stores.          |

---

## 🚀 Getting Started (for Contributors)

Follow these steps to set up the development environment on your local machine.

### 1. Clone the Repository

```bash
 git clone [https://github.com/TuwaIO/pulsar-core.git](https://github.com/TuwaIO/pulsar-core.git) cd pulsar-core
```

### 2. Install Dependencies

This project uses `pnpm` as its package manager.

```bash
 pnpm install
```

### 3. Build All Packages

After installation, build all packages to ensure the monorepo is correctly linked.

```bash
 pnpm build
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
