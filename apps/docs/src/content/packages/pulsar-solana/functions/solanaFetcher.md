# solanaFetcher()

> **solanaFetcher**(`params`): `Promise`\<`void`\>

Defined in: [trackers/solanaTracker.ts:117](https://github.com/TuwaIO/pulsar-core/blob/main/packages/pulsar-solana/src/trackers/solanaTracker.ts#L117)

A fetcher for `initializePollingTracker` from `@tuwaio/pulsar-core` that checks a Solana transaction once.

It sends `getSignatureStatuses` (with `searchTransactionHistory`, so transactions older than the node's recent status
cache are found after a page reload) to `tx.rpcUrl`, or to the public endpoint of the cluster in `tx.chainId`,
through a client cached by `createSolanaRPC` from `@tuwaio/orbit-solana`. Until it has the fee, blockhash and
instructions (from `tx`, or fetched on an earlier tick of the same tracking run and cached in memory for the `tx`
object), it also sends `getTransaction` (commitment `confirmed`).

- Signature not found, with `tx.lastValidBlockHeight` (or the one `signAndSendSolanaTx` recorded for the signature
  in this page): sends `getBlockHeight` (commitment `confirmed`); once the
  height is above it, checks the signature once more and, still not found, calls `onFailure` with `expired: true`
  and stops polling (the blockhash expired, so the transaction can never land).
- Signature not found otherwise: keeps polling; one hour after `localTimestamp` calls `onFailure()` and stops
  polling.
- Found: calls `onIntervalTick` with the status (`confirmationStatus` `processed`, `confirmed` or `finalized`, plus
  the details once `getTransaction` returns them), then: an on-chain error calls `onFailure` with it right away;
  `finalized` with the details calls `onSuccess`. A transaction not finalized one hour after `localTimestamp` calls
  `onFailure` with its status.

Every terminal outcome stops polling with `withoutRemoving: true`, so the transaction is never removed.
- RPC errors are thrown, so the polling tracker retries and gives up after `maxRetries` consecutive errors.

## Parameters

### params

[`PollingFetcherParams`](/packages/pulsar-core/type-aliases/PollingFetcherParams.md)\<[`SolanaSignatureStatusResponse`](/packages/pulsar-solana/type-aliases/SolanaSignatureStatusResponse.md), [`SolanaFetcherTx`](/packages/pulsar-solana/type-aliases/SolanaFetcherTx.md)\>

The fetcher parameters provided by `initializePollingTracker`.

## Returns

`Promise`\<`void`\>

A promise that resolves when the check is done.

## Throws

`Error` when `tx.adapter` is not `OrbitAdapter.SOLANA`, and any RPC error.

## Example

```ts
import { OrbitAdapter, SOLANA_CHAIN_IDS } from '@tuwaio/orbit-core';
import { initializePollingTracker } from '@tuwaio/pulsar-core';
import { solanaFetcher } from '@tuwaio/pulsar-solana';

initializePollingTracker({
  tx: { adapter: OrbitAdapter.SOLANA, txKey: signature, chainId: SOLANA_CHAIN_IDS.devnet, localTimestamp: now, pending: true },
  fetcher: solanaFetcher,
  onSuccess: (status) => console.log('Finalized in slot', status.slot),
  onFailure: (status) => console.error('Failed', status?.err),
});
```
