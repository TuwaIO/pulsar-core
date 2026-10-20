# @tuwaio/pulsar-evm

`@tuwaio/pulsar-evm` is the EVM Layer 4 (L4) package of **Pulsar**, the transaction tracking project of TUWA Stage 2 ("State & Connection", next to Satellite Connect). Built on **`@wagmi/core`**, **`viem`** and **`@tuwaio/orbit-evm`**, it provides the EVM adapter for [`@tuwaio/pulsar-core`](https://pulsar.docs.tuwa.io/packages/pulsar-core) and trackers for standard transactions, ERC-4337 UserOperations, EIP-5792 call batches, Safe multisig transactions and Gelato relay tasks (deprecated). It does not use `ethers.js` or `web3.js`.

---

## 🏛️ Core Capabilities

- **Adapter:** `pulsarEvmAdapter(wagmiConfig, appChains, options?)` reads the wallet from the active wagmi connection, asks the wallet to switch to `desiredChainID` before signing, picks the tracker, builds explorer links, and adds speed-up, cancel and retry actions for UI kits such as Nova Transactions.
- **Tracker routing:** the key returned by your `actionFunction` is tracked as a Safe transaction when the connector is a Safe wallet, and as a standard transaction otherwise. ERC-4337, EIP-5792 and Gelato are never detected automatically: pass `tracker: TransactionTracker.ERC4337` (or `EIP5792`, `Gelato`) in the transaction params.
- **Standard transactions:** `evmTracker` retries `getTransaction` while the node has not indexed the transaction yet, retries the receipt on transient RPC errors (timeouts, rate limits, 5xx), detects speed-ups and cancels made in the wallet (`Replaced` with `replacedTxHash`), waits for `requiredConfirmations` and records the block timestamp.
- **ERC-4337 UserOperations:** a two-stage tracker polls `eth_getUserOperationReceipt` on your bundler (`bundlerUrl`, or Pimlico with `pimlicoApiKey`), then follows the bundle transaction on-chain like a standard transaction. After a reload it resumes at the stage it reached.
- **EIP-5792 call batches:** for an `actionFunction` that returns the batch ID of `wallet_sendCalls` (`sendCalls` of `@wagmi/core`), a two-stage tracker asks the connected wallet for the batch status (`wallet_getCallsStatus`), then follows the transaction that executed the batch on-chain. The status comes from the wallet, so the wallet that sent the batch must stay connected until it is executed.
- **Safe multisig:** polls the Safe Transaction Service until the `safeTxHash` is executed, and reports it as replaced when another transaction with the same nonce was executed. While it waits, the transaction shows how many owners confirmed it (`confirmations`) out of the Safe threshold (`requiredConfirmations`), which Nova Transactions displays as "x / y". It is checked every 5 s for the first hour of tracking, then every 30 s. By default the tracker gives up one day after the transaction was proposed; set `safePendingTimeoutMs` in the adapter options for Safes whose owners need longer, or `null` to wait without a limit.
- **Safe without wagmi:** `@tuwaio/pulsar-evm/safe` exports the Safe tracker alone (`createSafeFetcher`, `safeFetcher`, `safeTrackerForStore`, `SafeTransactionServiceUrls`). It loads neither `@wagmi/core` nor `@tuwaio/orbit-evm`, so apps built on `viem` alone can use it.
- **Speed up and cancel:** `speedUpTxAction` and `cancelTxAction` resend a pending EIP-1559 transaction with the same nonce and fees raised by 15%; the original tracker then reports it as `Replaced`.
- **Standalone use:** the trackers and fetchers work without the store, in your own state or on a server. See [EVM Trackers Standalone](https://pulsar.docs.tuwa.io/evmStandalone).

Trackers write their results to the store with `updateTxParams`, and the `onSuccess`, `onError` and `onReplaced` callbacks of `executeTxAction` receive the updated transaction; the store's `onTxFinished` and `subscribeTxFinished` run for every finished transaction, also after a reload. No tracker removes a transaction from the pool: when a tracker gives up (for example a Safe transaction still not executed when `safePendingTimeoutMs` runs out), the transaction is marked `Failed` with the reason in `error` and stays in the pool.

---

## 💾 Installation

```bash
pnpm add @tuwaio/pulsar-evm @tuwaio/pulsar-core @tuwaio/orbit-core @tuwaio/orbit-evm @wagmi/core viem zustand immer dayjs
```

> [!IMPORTANT]
> `@tuwaio/pulsar-core` (>=0.10), `@tuwaio/orbit-core` (>=0.4), `viem` (2.x) and `dayjs` (1.x) are peer dependencies and must be installed alongside `@tuwaio/pulsar-evm`. The main entry also needs `@tuwaio/orbit-evm` (>=0.3) and `@wagmi/core` (3.x); they are optional peers because the `@tuwaio/pulsar-evm/safe` entry does not use them. `zustand` and `immer` are the peer dependencies of `@tuwaio/pulsar-core`.

For the Safe tracker alone, on `viem` without wagmi:

```bash
pnpm add @tuwaio/pulsar-evm @tuwaio/pulsar-core @tuwaio/orbit-core viem dayjs
```

---

## 🚀 Usage

Add the adapter to the store and pass `tracker` for UserOperations:

```typescript
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createPimlicoSmartAccountClient } from '@tuwaio/orbit-evm';
import { createPulsarStore, type EvmTransaction, TransactionTracker } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { type Config } from '@wagmi/core';
import { mainnet, sepolia } from 'viem/chains';

declare const wagmiConfig: Config;
const pimlicoApiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;

export const pulsarStore = createPulsarStore<EvmTransaction>({
  name: 'pulsar-transactions',
  // Safe owners get three days to collect their signatures before the tracker gives up
  adapter: pulsarEvmAdapter(wagmiConfig, [mainnet, sepolia], { safePendingTimeoutMs: 3 * 24 * 60 * 60 * 1000 }),
});

export async function pingWithSmartAccount() {
  await pulsarStore.getState().executeTxAction({
    actionFunction: async () => {
      const { account, bundlerClient } = await createPimlicoSmartAccountClient({
        chain: sepolia,
        wagmiConfig,
        apiKey: pimlicoApiKey,
      });
      // Returns the userOpHash, which becomes the txKey.
      return bundlerClient.sendUserOperation({ account, calls: [{ to: account.address, value: 0n }] });
    },
    params: {
      adapter: OrbitAdapter.EVM,
      desiredChainID: sepolia.id,
      type: 'ping',
      title: 'Smart account ping',
      tracker: TransactionTracker.ERC4337, // required for UserOperations
      pimlicoApiKey, // or bundlerUrl; saved locally to resume tracking after a reload, never sent to onRemoteCreate
    },
  });
}
```

The step-by-step React setup is in the **[React transaction tracking guide](https://docs.tuwa.io/guides/react-transaction-tracking)**, and tracking without the store on **[EVM Trackers Standalone](https://pulsar.docs.tuwa.io/evmStandalone)**.

---

## 🌐 External Services

The trackers send requests to these hosts. The transaction hash, `userOpHash` or `safeTxHash` (and for Safe, the Safe address) is sent to them:

| Tracker             | Host                                                                                                                    | Purpose                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Standard, stage 2   | The RPC transports of your wagmi config                                                                                 | `getTransaction`, receipts, confirmations and block timestamps              |
| ERC-4337 stage 1    | `bundlerUrl`, else `api.pimlico.io` (with `pimlicoApiKey` in the URL), else the rate-limited public `public.pimlico.io` | `eth_getUserOperationReceipt`                                               |
| EIP-5792 stage 1    | The connected wallet (no host): `wallet_getCallsStatus` through the wagmi connector                                     | Status of the call batch and the hash of the transaction that executed it   |
| Safe                | `safe-transaction-<network>.safe.global` (see `SafeTransactionServiceUrls`)                                             | Status of the multisig transaction and of other transactions with its nonce |
| Gelato (deprecated) | `api.gelato.cloud`, with the Gelato API key as a `Bearer` token                                                         | `relayer_getStatus` and `relayer_getCapabilities`                           |

Explorer links point to the block explorer configured in your viem chains, or to `app.safe.global` for Safe transactions; they are not requested by the package.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[pulsar.docs.tuwa.io/packages/pulsar-evm](https://pulsar.docs.tuwa.io/packages/pulsar-evm)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/LICENSE) file for details.

## Enumerations

- [~~GelatoStatusCode~~](/packages/pulsar-evm/enumerations/GelatoStatusCode.md)

## Type Aliases

- [Eip5792FetcherTx](/packages/pulsar-evm/type-aliases/Eip5792FetcherTx.md)
- [Eip5792FetchResult](/packages/pulsar-evm/type-aliases/Eip5792FetchResult.md)
- [Eip5792TrackerConfig](/packages/pulsar-evm/type-aliases/Eip5792TrackerConfig.md)
- [Eip5792TrackerForStoreParams](/packages/pulsar-evm/type-aliases/Eip5792TrackerForStoreParams.md)
- [Erc4337FetcherTx](/packages/pulsar-evm/type-aliases/Erc4337FetcherTx.md)
- [Erc4337FetchResult](/packages/pulsar-evm/type-aliases/Erc4337FetchResult.md)
- [Erc4337TrackerConfig](/packages/pulsar-evm/type-aliases/Erc4337TrackerConfig.md)
- [Erc4337TrackerForStoreParams](/packages/pulsar-evm/type-aliases/Erc4337TrackerForStoreParams.md)
- [Erc4337UserOpReceipt](/packages/pulsar-evm/type-aliases/Erc4337UserOpReceipt.md)
- [EVMTrackerParams](/packages/pulsar-evm/type-aliases/EVMTrackerParams.md)
- [~~GelatoBaseStatus~~](/packages/pulsar-evm/type-aliases/GelatoBaseStatus.md)
- [~~GelatoCapabilities~~](/packages/pulsar-evm/type-aliases/GelatoCapabilities.md)
- [~~GelatoCapabilitiesByChain~~](/packages/pulsar-evm/type-aliases/GelatoCapabilitiesByChain.md)
- [~~GelatoClientConfig~~](/packages/pulsar-evm/type-aliases/GelatoClientConfig.md)
- [~~GelatoTaskStatus~~](/packages/pulsar-evm/type-aliases/GelatoTaskStatus.md)
- [~~GelatoToken~~](/packages/pulsar-evm/type-aliases/GelatoToken.md)
- [InitializeTrackerParams](/packages/pulsar-evm/type-aliases/InitializeTrackerParams.md)
- [SafeTrackerOptions](/packages/pulsar-evm/type-aliases/SafeTrackerOptions.md)
- [SafeTxStatusResponse](/packages/pulsar-evm/type-aliases/SafeTxStatusResponse.md)

## Variables

- [~~gelatoTracker~~](/packages/pulsar-evm/variables/gelatoTracker.md)
- [gnosisSafeLinksHelper](/packages/pulsar-evm/variables/gnosisSafeLinksHelper.md)
- [SAFE\_DEFAULT\_PENDING\_TIMEOUT\_MS](/packages/pulsar-evm/variables/SAFE_DEFAULT_PENDING_TIMEOUT_MS.md)
- [safeFetcher](/packages/pulsar-evm/variables/safeFetcher.md)
- [safeSdkOptions](/packages/pulsar-evm/variables/safeSdkOptions.md)
- [SafeTransactionServiceUrls](/packages/pulsar-evm/variables/SafeTransactionServiceUrls.md)

## Functions

- [cancelTxAction](/packages/pulsar-evm/functions/cancelTxAction.md)
- [checkAndInitializeTrackerInStore](/packages/pulsar-evm/functions/checkAndInitializeTrackerInStore.md)
- [~~checkIsGelatoAvailable~~](/packages/pulsar-evm/functions/checkIsGelatoAvailable.md)
- [checkTransactionsTracker](/packages/pulsar-evm/functions/checkTransactionsTracker.md)
- [createEip5792Fetcher](/packages/pulsar-evm/functions/createEip5792Fetcher.md)
- [~~createGelatoClient~~](/packages/pulsar-evm/functions/createGelatoClient.md)
- [createSafeFetcher](/packages/pulsar-evm/functions/createSafeFetcher.md)
- [eip5792Tracker](/packages/pulsar-evm/functions/eip5792Tracker.md)
- [eip5792TrackerForStore](/packages/pulsar-evm/functions/eip5792TrackerForStore.md)
- [erc4337Fetcher](/packages/pulsar-evm/functions/erc4337Fetcher.md)
- [erc4337Tracker](/packages/pulsar-evm/functions/erc4337Tracker.md)
- [erc4337TrackerForStore](/packages/pulsar-evm/functions/erc4337TrackerForStore.md)
- [evmTracker](/packages/pulsar-evm/functions/evmTracker.md)
- [evmTrackerForStore](/packages/pulsar-evm/functions/evmTrackerForStore.md)
- [~~gelatoFetcher~~](/packages/pulsar-evm/functions/gelatoFetcher.md)
- [~~gelatoTrackerForStore~~](/packages/pulsar-evm/functions/gelatoTrackerForStore.md)
- [isRetryableReceiptError](/packages/pulsar-evm/functions/isRetryableReceiptError.md)
- [pulsarEvmAdapter](/packages/pulsar-evm/functions/pulsarEvmAdapter.md)
- [safePollingInterval](/packages/pulsar-evm/functions/safePollingInterval.md)
- [safeTrackerForStore](/packages/pulsar-evm/functions/safeTrackerForStore.md)
- [selectEvmTxExplorerLink](/packages/pulsar-evm/functions/selectEvmTxExplorerLink.md)
- [speedUpTxAction](/packages/pulsar-evm/functions/speedUpTxAction.md)
