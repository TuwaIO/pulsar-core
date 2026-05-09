# 🤖 Agent Context: Pulsar Engine

## 1. Project Philosophy & Goal

- **What is this?** A monorepo for the **Pulsar Engine** — a headless, framework-agnostic state management system for tracking the lifecycle of Web3 transactions (pending, success, failed, replaced).
- **Role in TUWA:** The "Brain" of transaction tracking. It provides the core logic that powers UI layers (like Nova UI Kit) but contains zero UI itself.
- **Philosophy:** "Pure Web3", Headless, Multi-Chain by Design, Persistent State (resumes tracking after reload).

## 2. Tech Stack (Verified)

- **Core:** TypeScript v5.9+, Node.js, pnpm v10+ (Workspace).
- **State Management:** `zustand` v5.x, `immer` v11.x (Immutable state updates).
- **Web3 (EVM):** `viem` v2.x, `@wagmi/core` v3.x.
- **Web3 (Solana):** `gill` v0.14+, `@wallet-standard/*`.
- **Frameworks:**
  - `apps/docs`: Next.js v16, Nextra v4, Tailwind CSS v4.
  - `packages/pulsar-react`: React v19.
- **Build/Monorepo:**
  - `tsup`: Bundler for `packages/*` (ESM/CJS/DTS).
  - `typedoc`: Documentation generation.
  - `semantic-release`: Automated versioning and publishing.

## 3. Architecture & Directory Structure

The project is a **pnpm workspace** separating core state logic from chain-specific adapters and framework bindings.

```
pulsar-core/
├── apps/
│   └── docs/                   # Documentation site (Nextjs 16 + Nextra 4)
│       ├── src/content/        # MDX Structure mapping to URL
│       └── src/components/     # Custom Docs Components
├── packages/
│   ├── pulsar-core/            # THE BRAIN. Framework-agnostic State Machine.
│   │   ├── src/store/          # Zustand store logic
│   │   ├── src/types.ts        # Core Enums (TransactionStatus, etc.)
│   │   └── src/utils/          # Storage & ID helpers
│   ├── pulsar-evm/             # THE MUSCLE (EVM).
│   │   ├── src/adapters/       # Viem/Wagmi integration
│   │   └── src/trackers/       # Transaction polling logic
│   ├── pulsar-solana/          # THE MUSCLE (Solana).
│   │   ├── src/adapters/       # Wallet Standard integration
│   │   ├── src/trackers/       # Solana signature subscription logic
│   │   └── src/errors.ts       # Solana-specific error handling
│   └── pulsar-react/           # BINDINGS.
│       ├── src/hooks/          # useInitializeTransactionsPool, etc.
│       └── src/index.ts        # React Context & Hooks exports
├── package.json                # Root checks & scripts
└── pnpm-workspace.yaml         # Workspace definition
```

### Module Breakdown

- **`pulsar-core`**: The absolute core. Defines the _shape_ of a transaction and how to update it. Zero external Web3 dependencies.
- **`pulsar-evm`**: Adapter that teaches Pulsar how to talk to Ethereum. Uses `viem` for RPC calls and `wagmi` for chain alignment.
- **`pulsar-solana`**: Adapter that teaches Pulsar how to talk to Solana. Uses `gill` for modern RPC interactions.
- **`pulsar-react`**: React-specific wrapper to make using Pulsar easy in React apps (hooks, lifecycle management).

## 4. Coding Standards (STRICT)

- **Language:** English ONLY (Code, Comments, Commits).
- **Style:** Functional programming. Immutable state updates via `immer` inside Zustand.
- **Types:** Strict TypeScript. **NO `any`**.
- **Comments:** JSDoc required for **all** APIs exported from packages.
- **Naming:**
  - Files: `camelCase.ts` (utils, hooks), `PascalCase.tsx` (components).
  - Variables/Functions: `camelCase`.
  - Types/Interfaces: `PascalCase`.

## 5. Key Workflows

- **Build:** `pnpm build` (Runs `tsup` for packages and `next build` for docs).
- **Test:** `pnpm test` (Runs `vitest` in isolated packages).
- **Lint/Format:** `pnpm lint` (ESLint) / `pnpm format` (Prettier).
- **Docs:** `pnpm docs:gen` (Generates API docs via Typedoc).
- **Clean:** `pnpm clean` (Nukes `node_modules` and `dist` dirs).

## 6. AI Agent Behavior (Mandatory)

- **Post-Work Routine:** After generating or modifying code, the Agent MUST run `pnpm lint --fix` (or `pnpm format`) to ensure code quality.
- **Dependency Rule:** Never install new packages without explicit user permission.
- **Hallucination Check:**
  - Do **NOT** import `ethers.js` (We use `viem`).
  - Do **NOT** import legacy `@solana/web3.js` classes unless wrapped by `gill`.
  - Do **NOT** assume UI components exist in `pulsar-core` (It is headless). UI lives in `nova-uikit`.
