# pulsarSolanaAdapter()

> **pulsarSolanaAdapter**\<`T`\>(`config`): [`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\>

Defined in: [adapters/solanaAdapter.ts:68](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/adapters/solanaAdapter.ts#L68)

Creates the Solana adapter for `createPulsarStore` from `@tuwaio/pulsar-core`. Pass it alone or in the adapter array.

The adapter reads the connected wallet from the last connection saved in `localStorage` by `@tuwaio/orbit-core`
(Satellite Connect writes it) and finds the matching Wallet Standard wallet with `getConnectedSolanaConnector` from
`@tuwaio/orbit-solana`. It implements `TxAdapter` from `@tuwaio/pulsar-core`:
- `getConnectorInfo` returns the saved address and the connector type, e.g. `solana:phantom`. It throws when no
  installed wallet holds the saved address.
- `checkChainForTx` compares `desiredChainID` with the saved chain of the connection, ignoring a `solana:` prefix
  (`devnet` and `solana:devnet` are the same cluster), and throws [SolanaChainMismatchError](/packages/pulsar-solana/classes/SolanaChainMismatchError.md) when they differ.
  It does not switch the wallet.
- `checkTransactionsTracker` keeps the returned signature as `txKey` and uses `TransactionTracker.Solana` unless
  another tracker is requested.
- `checkAndInitializeTrackerInStore` is [checkAndInitializeTrackerInStore](/packages/pulsar-solana/functions/checkAndInitializeTrackerInStore.md).
- `getExplorerUrl` and `getExplorerTxUrl` build Solana Explorer links with `getSolanaExplorerLink` from
  `@tuwaio/orbit-solana`.
- `retryTxAction` closes the modal and runs `executeTxAction` again with `tx.actionFunction({ client, ...tx.payload })`,
  where `client` is a cached RPC client for `tx.rpcUrl` or the cluster of `desiredChainID`. It throws when no wallet
  is connected or `executeTxAction` is missing.

There is no `cancelTxAction` or `speedUpTxAction` for Solana.

## Type Parameters

### T

`T` *extends* [`Transaction`](/packages/pulsar-core/type-aliases/Transaction.md)

The application transaction type.

## Parameters

### config

[`SolanaAdapterConfig`](/packages/pulsar-solana/interfaces/SolanaAdapterConfig.md)

The RPC URLs by cluster.

## Returns

[`TxAdapter`](/packages/pulsar-core/type-aliases/TxAdapter.md)\<`T`\>

The Solana adapter.

## Example

```ts
import { createPulsarStore } from '@tuwaio/pulsar-core';
import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';

const pulsarStore = createPulsarStore({
  name: 'transactions-tracking-storage',
  adapter: pulsarSolanaAdapter({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } }),
});
```
