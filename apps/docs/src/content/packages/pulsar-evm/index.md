# @tuwaio/pulsar-evm

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/pulsar-evm.svg)](https://www.npmjs.com/package/@tuwaio/pulsar-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/pulsar-evm.svg)](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/LICENSE)

`@tuwaio/pulsar-evm` is the EVM Layer 4 (L4) package of **Pulsar**, the transaction tracking project of TUWA Stage 2 ("State & Connection", next to Satellite Connect). Built on **`@wagmi/core`**, **`viem`** and **`@tuwaio/orbit-evm`**, it provides the EVM adapter for [`@tuwaio/pulsar-core`](https://pulsar.docs.tuwa.io/packages/pulsar-core) and trackers for standard transactions, ERC-4337 UserOperations, Safe multisig transactions and Gelato relay tasks (deprecated). It does not use `ethers.js` or `web3.js`.

---

## 🏛️ Core Capabilities

- **Adapter:** `pulsarEvmAdapter(wagmiConfig, appChains)` reads the wallet from the active wagmi connection, asks the wallet to switch to `desiredChainID` before signing, picks the tracker, builds explorer links, and adds speed-up, cancel and retry actions for UI kits such as Nova Transactions.
- **Tracker routing:** the key returned by your `actionFunction` is tracked as a Safe transaction when the connector is a Safe wallet, and as a standard transaction otherwise. ERC-4337 and Gelato are never detected automatically: pass `tracker: TransactionTracker.ERC4337` (or `Gelato`) in the transaction params.
- **Standard transactions:** `evmTracker` retries `getTransaction` while the node has not indexed the transaction yet, retries the receipt on transient RPC errors (timeouts, rate limits, 5xx), detects speed-ups and cancels made in the wallet (`Replaced` with `replacedTxHash`), waits for `requiredConfirmations` and records the block timestamp.
- **ERC-4337 UserOperations:** a two-stage tracker polls `eth_getUserOperationReceipt` on your bundler (`bundlerUrl`, or Pimlico with `pimlicoApiKey`), then follows the bundle transaction on-chain like a standard transaction. After a reload it resumes at the stage it reached.
- **Safe multisig:** polls the Safe Transaction Service until the `safeTxHash` is executed, and reports it as replaced when another transaction with the same nonce was executed.
- **Speed up and cancel:** `speedUpTxAction` and `cancelTxAction` resend a pending EIP-1559 transaction with the same nonce and fees raised by 15%; the original tracker then reports it as `Replaced`.
- **Standalone use:** the trackers and fetchers work without the store, in your own state or on a server. See [EVM Trackers Standalone](https://pulsar.docs.tuwa.io/evmStandalone).

Trackers write their results to the store with `updateTxParams`, and the `onSuccess`, `onError` and `onReplaced` callbacks of `executeTxAction` receive the updated transaction. No tracker removes a transaction from the pool: when a tracker gives up (for example a Safe transaction still not executed a day after it was proposed), the transaction is marked `Failed` with the reason in `error` and stays in the pool.

---

## 💾 Installation

```bash
pnpm add @tuwaio/pulsar-evm @tuwaio/pulsar-core @tuwaio/orbit-core @tuwaio/orbit-evm @wagmi/core viem zustand immer dayjs
```

> [!IMPORTANT]
> `@tuwaio/pulsar-core` (>=0.9), `@tuwaio/orbit-core` (>=0.4), `@tuwaio/orbit-evm` (>=0.3), `@wagmi/core` (3.x), `viem` (2.x) and `dayjs` (1.x) are peer dependencies and must be installed alongside `@tuwaio/pulsar-evm`. `zustand` and `immer` are the peer dependencies of `@tuwaio/pulsar-core`.

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
  adapter: pulsarEvmAdapter(wagmiConfig, [mainnet, sepolia]),
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

| Tracker                    | Host                                                                                                                    | Purpose                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Standard, ERC-4337 stage 2 | The RPC transports of your wagmi config                                                                                 | `getTransaction`, receipts, confirmations and block timestamps              |
| ERC-4337 stage 1           | `bundlerUrl`, else `api.pimlico.io` (with `pimlicoApiKey` in the URL), else the rate-limited public `public.pimlico.io` | `eth_getUserOperationReceipt`                                               |
| Safe                       | `safe-transaction-<network>.safe.global` (see `SafeTransactionServiceUrls`)                                             | Status of the multisig transaction and of other transactions with its nonce |
| Gelato (deprecated)        | `api.gelato.cloud`, with the Gelato API key as a `Bearer` token                                                         | `relayer_getStatus` and `relayer_getCapabilities`                           |

Explorer links point to the block explorer configured in your viem chains, or to `app.safe.global` for Safe transactions; they are not requested by the package.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[pulsar.docs.tuwa.io/packages/pulsar-evm](https://pulsar.docs.tuwa.io/packages/pulsar-evm)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/LICENSE) file for details.

## Enumerations

- [~~GelatoStatusCode~~](/packages/pulsar-evm/enumerations/GelatoStatusCode.md)

## Type Aliases

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
- [SafeTxStatusResponse](/packages/pulsar-evm/type-aliases/SafeTxStatusResponse.md)

## Variables

- [~~gelatoTracker~~](/packages/pulsar-evm/variables/gelatoTracker.md)
- [gnosisSafeLinksHelper](/packages/pulsar-evm/variables/gnosisSafeLinksHelper.md)
- [safeSdkOptions](/packages/pulsar-evm/variables/safeSdkOptions.md)
- [SafeTransactionServiceUrls](/packages/pulsar-evm/variables/SafeTransactionServiceUrls.md)

## Functions

- [cancelTxAction](/packages/pulsar-evm/functions/cancelTxAction.md)
- [checkAndInitializeTrackerInStore](/packages/pulsar-evm/functions/checkAndInitializeTrackerInStore.md)
- [~~checkIsGelatoAvailable~~](/packages/pulsar-evm/functions/checkIsGelatoAvailable.md)
- [checkTransactionsTracker](/packages/pulsar-evm/functions/checkTransactionsTracker.md)
- [~~createGelatoClient~~](/packages/pulsar-evm/functions/createGelatoClient.md)
- [erc4337Fetcher](/packages/pulsar-evm/functions/erc4337Fetcher.md)
- [erc4337Tracker](/packages/pulsar-evm/functions/erc4337Tracker.md)
- [erc4337TrackerForStore](/packages/pulsar-evm/functions/erc4337TrackerForStore.md)
- [evmTracker](/packages/pulsar-evm/functions/evmTracker.md)
- [evmTrackerForStore](/packages/pulsar-evm/functions/evmTrackerForStore.md)
- [~~gelatoFetcher~~](/packages/pulsar-evm/functions/gelatoFetcher.md)
- [~~gelatoTrackerForStore~~](/packages/pulsar-evm/functions/gelatoTrackerForStore.md)
- [isRetryableReceiptError](/packages/pulsar-evm/functions/isRetryableReceiptError.md)
- [pulsarEvmAdapter](/packages/pulsar-evm/functions/pulsarEvmAdapter.md)
- [safeFetcher](/packages/pulsar-evm/functions/safeFetcher.md)
- [safeTrackerForStore](/packages/pulsar-evm/functions/safeTrackerForStore.md)
- [selectEvmTxExplorerLink](/packages/pulsar-evm/functions/selectEvmTxExplorerLink.md)
- [speedUpTxAction](/packages/pulsar-evm/functions/speedUpTxAction.md)
