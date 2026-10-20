# pulsarEvmAdapter()

> **pulsarEvmAdapter**\<`T`\>(`config`, `appChains`, `options?`): [`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\>

Defined in: [adapters/evmAdapter.ts:58](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-evm/src/adapters/evmAdapter.ts#L58)

Creates the EVM adapter for `createPulsarStore` from `@tuwaio/pulsar-core`. Pass it alone or in the adapter array.

The adapter implements `TxAdapter` from `@tuwaio/pulsar-core`:
- `getConnectorInfo` returns the address of the active wagmi connection (or, without one, the last connected address
  saved by `@tuwaio/orbit-core` in `localStorage` or `sessionStorage`, then the zero address) and the connector type,
  e.g. `evm:metamask`.
- `checkChainForTx` runs `checkAndSwitchChain` from `@tuwaio/orbit-evm`: when the wallet is on another chain, it asks
  the wallet to switch and rejects if the user declines.
- `checkTransactionsTracker` and `checkAndInitializeTrackerInStore` are [checkTransactionsTracker](/packages/pulsar-evm/functions/checkTransactionsTracker.md) and
  [checkAndInitializeTrackerInStore](/packages/pulsar-evm/functions/checkAndInitializeTrackerInStore.md).
- `getExplorerUrl(path, chainId)` appends a path to the default block explorer of `chainId` (looked up in
  `appChains`), or of the chain the wallet is connected to when `chainId` is omitted. It returns `undefined` when that
  chain has no block explorer. `getExplorerTxUrl` is [selectEvmTxExplorerLink](/packages/pulsar-evm/functions/selectEvmTxExplorerLink.md) with `appChains`.
- `cancelTxAction` and `speedUpTxAction` are [cancelTxAction](/packages/pulsar-evm/functions/cancelTxAction.md) and [speedUpTxAction](/packages/pulsar-evm/functions/speedUpTxAction.md); both open a wallet
  prompt.
- `retryTxAction` closes the modal and runs `executeTxAction` again with
  `tx.actionFunction({ config, ...tx.payload })`; it logs an error and does nothing without `executeTxAction`.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### config

`Config`

The wagmi config of the app.

### appChains

readonly \[`Chain`, `Chain`\]

The viem chains of the app, used to build explorer links.

### options?

The adapter options.

#### safePendingTimeoutMs?

`number` \| `null`

How long a Safe transaction may stay unexecuted, from when it was proposed,
before the Safe tracker marks it `Failed`; `null` waits without a limit. Defaults to one day. As part of the adapter it
also applies to trackers restarted after a page reload.

## Returns

[`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\>

The EVM adapter.

## Throws

`Error` when `config` is not provided.

## Example

```ts
import { createPulsarStore } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { mainnet, sepolia } from 'viem/chains';

const pulsarStore = createPulsarStore({
  name: 'transactions-tracking-storage',
  adapter: pulsarEvmAdapter(wagmiConfig, [mainnet, sepolia]),
});
```
