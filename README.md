# Pulsar Engine

[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-core.svg)](./LICENSE)
[![Contributors](https://img.shields.io/github/contributors/TuwaIO/pulsar-core)](https://github.com/TuwaIO/pulsar-core/graphs/contributors)

Welcome to the official monorepo for the **Pulsar Engine**, a headless state management system for tracking Web3 transactions.

---

## 🏛️ Architecture Philosophy

Pulsar is the "brain" behind TUWA's transaction tracking capabilities. It's a **headless** engine, meaning it contains no UI components. Its sole purpose is to provide a robust, reliable, and extensible system for managing the lifecycle of on-chain transactions across different blockchain ecosystems.

It is designed to be consumed by any UI layer, with our official implementation being the **[Nova UI Kit](https://github.com/TuwaIO/nova-uikit)**.

The architecture is modular and layered:

- 🧠 **Core (`@tuwaio/pulsar-core`):** A framework-agnostic state machine that knows _how_ to manage state but nothing about specific blockchains.
- 🔌 **Adapters (`@tuwaio/pulsar-evm`):** Platform-specific modules that plug into the core. They teach Pulsar _how_ to interact with a specific ecosystem (e.g., EVM chains via Viem).
- ⚛️ **Bindings (`@tuwaio/pulsar-react`):** Framework-specific packages that provide hooks and utilities to easily connect Pulsar to a UI framework's lifecycle.

---

## ✨ Key Features

- **Framework-Agnostic Core:** Built with Zustand and Immer for maximum portability.
- **Multi-Chain by Design:** The adapter pattern allows for extending support to any blockchain.
- **Persistent State:** Automatically resumes tracking pending transactions after a page reload.
- **Rich EVM Support:** The official EVM adapter includes trackers for standard transactions, Safe multisigs, and Gelato meta-transactions.
- **Type-Safe:** Written entirely in TypeScript to ensure a robust developer experience.

---

## 📦 Packages

This repository is a monorepo managed using `pnpm` workspaces.

| Package                       | Version                                                                                                                     | Description                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 🧠 **`@tuwaio/pulsar-core`**  | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-core.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-core)   | The framework-agnostic core with the main state machine, types, and utilities. |
| 🔌 **`@tuwaio/pulsar-evm`**   | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-evm.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-evm)     | An adapter for EVM-compatible chains. Integrates with Wagmi and Viem.          |
| ⚛️ **`@tuwaio/pulsar-react`** | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-react.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-react) | React bindings, including the `useInitializeTransactionsPool` hook.            |

---

## 🚀 Getting Started (for Contributors)

Follow these steps to set up the development environment on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/TuwaIO/pulsar-core.git](https://github.com/TuwaIO/pulsar-core.git)
cd pulsar-core
```

### 2\. Install Dependencies

This project uses `pnpm` as its package manager.

```bash
pnpm install
```

### 3\. Build All Packages

After installation, build all packages to ensure the monorepo is correctly linked.

```bash
pnpm build
```

---

## 💻 Development Workflow

### Running Tests

Testing is the primary development workflow. To run the test suite for all packages, use the following command from the root directory:

```bash
pnpm test
```

You can also run tests in **watch mode** for a specific package:

```bash
# Example for the EVM package
pnpm --filter @tuwaio/pulsar-evm test --watch
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
