/**
 * @file The last valid block heights of transactions sent with `signAndSendSolanaTx`, kept in memory until the store
 * tracker saves them with the transaction (or for `solanaFetcher` used without the store).
 */

/** Entries beyond this many are dropped, oldest first, for transactions that are never tracked. */
const MAX_ENTRIES = 100;

const lifetimes = new Map<string, number>();

/**
 * Records the last valid block height of a sent transaction.
 *
 * @param signature - The base58 signature of the transaction.
 * @param lastValidBlockHeight - The last block height at which its blockhash is valid.
 * @internal
 */
export function rememberSolanaTxLifetime(signature: string, lastValidBlockHeight: number): void {
  lifetimes.set(signature, lastValidBlockHeight);
  if (lifetimes.size > MAX_ENTRIES) {
    lifetimes.delete(lifetimes.keys().next().value as string);
  }
}

/**
 * Returns the last valid block height recorded for a signature, keeping it (for {@link solanaFetcher} used without the
 * store, which runs on every tick).
 *
 * @param signature - The base58 signature of the transaction.
 * @returns The last valid block height, or `undefined` when none was recorded.
 * @internal
 */
export function peekSolanaTxLifetime(signature: string): number | undefined {
  return lifetimes.get(signature);
}

/**
 * Returns and forgets the last valid block height recorded for a signature.
 *
 * @param signature - The base58 signature of the transaction.
 * @returns The last valid block height, or `undefined` when none was recorded.
 * @internal
 */
export function takeSolanaTxLifetime(signature: string): number | undefined {
  const lastValidBlockHeight = lifetimes.get(signature);
  lifetimes.delete(signature);
  return lastValidBlockHeight;
}
