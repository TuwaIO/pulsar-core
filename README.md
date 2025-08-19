# Pulsar Engine

[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/pulsar-core/release.yml?branch=main)](https://github.com/TuwaIO/pulsar-core/actions)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-core.svg)](./LICENSE)
[![Contributors](https://img.shields.io/github/contributors/TuwaIO/pulsar-core)](https://github.com/TuwaIO/pulsar-core/graphs/contributors)

Welcome to the monorepo for the **Pulsar Engine**, the headless state management system for tracking Web3 transactions in the TUWA ecosystem.

## 🏛️ Architecture Philosophy

Pulsar is the "brain" behind TUWA's transaction tracking capabilities. It's a **headless** engine, meaning it contains no UI components. Its sole purpose is to provide a robust, reliable, and extensible system for managing the lifecycle of on-chain transactions.

It is designed to be consumed by any UI layer, with our official implementation being the **[Nova UI Kit](https://github.com/TuwaIO/nova-uikit)**.

The architecture is modular:
-   **Core:** A framework-agnostic state machine.
-   **Adapters:** Platform-specific modules (e.g., for EVM chains).
-   **Connectors:** Framework-specific bindings (e.g., for React).

## 📦 Packages in this Monorepo

This repository is managed using `pnpm` workspaces.

| Package | Version | Description |
|---|---|---|
| 🧠 **`@tuwaio/pulsar-core`** | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-core.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-core) | The framework-agnostic core with the main state machine, types, and utilities. |
| 🔌 **`@tuwaio/pulsar-evm`** | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-evm.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-evm) | An adapter for EVM-compatible chains. Integrates with Wagmi and Viem. |
| ⚛️ **`@tuwaio/pulsar-react`** | [![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-react.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-react) | React bindings, including `useInitializeTransactionsPool` hook. |

## 🛠 Tech Stack

-   **Core Logic**: TypeScript
-   **State Management**: Zustand & Immer
-   **Web3**: Viem
-   **Tooling**: pnpm, Vitest, ESLint, Prettier, Husky

---

## 🚀 Getting Started (for Contributors)

Follow these steps to set up the development environment on your local machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/TuwaIO/pulsar-core.git](https://github.com/TuwaIO/pulsar-core.git)
cd pulsar-core
```

### 2. Install Dependencies
This project uses `pnpm`. Make sure you have it installed (`npm install -g pnpm`). Then run:
```bash
pnpm install
```

### 3. Build All Packages
After installation, build all packages to ensure everything is linked correctly.
```bash
pnpm build
```

## 💻 Development Workflow

For a logic-heavy library like Pulsar, testing is the primary development workflow.

### Running Tests
To run the test suite for all packages, use the following command from the root:
```bash
pnpm test
```
You can also run tests in watch mode for a specific package:
```bash
pnpm --filter @tuwaio/pulsar-evm test --watch
```

### Other Useful Commands
-   `pnpm lint`: Run the linter across all packages.
-   `pnpm format`: Format all code using Prettier.
-   `pnpm clean`: Remove all `node_modules` and `dist` folders.

## 🤝 Contributing

We welcome contributions to improve the core logic of our ecosystem. Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)** for details on our code of conduct, commit message standards, and the pull request process.

## 📄 License

This project is licensed under the **Apache-2.0 License**.