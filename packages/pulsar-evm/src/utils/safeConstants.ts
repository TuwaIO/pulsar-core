/**
 * @file This file contains constants related to Safe (formerly Gnosis Safe) configuration,
 * including SDK options, web app URLs, and transaction service API endpoints for various chains.
 */

import {
  arbitrum,
  aurora,
  avalanche,
  base,
  boba,
  bsc,
  celo,
  gnosis,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
  zksync,
} from 'viem/chains';

/**
 * Configuration options for the Safe Apps SDK.
 * This is typically used when integrating with the Safe environment.
 */
export const safeSdkOptions = {
  // A list of allowed domains to interact with the Safe Apps SDK.
  allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /metissafe.tech$/],
  // A flag to enable or disable debug logging for the SDK.
  debug: false,
};

/**
 * A mapping of chain IDs to their corresponding Safe web application URL prefixes.
 * Used by selectors like `selectTxExplorerLink` to build correct links for Safe transactions.
 * The prefixes (e.g., 'eth:', 'gor:') are part of the Safe URL scheme.
 * @type {Record<number, string>}
 */
export const gnosisSafeLinksHelper: Record<number, string> = {
  [mainnet.id]: 'https://app.safe.global/eth:',
  [goerli.id]: 'https://app.safe.global/gor:',
  [sepolia.id]: 'https://app.safe.global/sep:',
  [polygon.id]: 'https://app.safe.global/matic:',
  [arbitrum.id]: 'https://app.safe.global/arb1:',
  [aurora.id]: 'https://app.safe.global/aurora:',
  [avalanche.id]: 'https://app.safe.global/avax:',
  [base.id]: 'https://app.safe.global/base:',
  [boba.id]: 'https://app.safe.global/boba:',
  [bsc.id]: 'https://app.safe.global/bnb:',
  [celo.id]: 'https://app.safe.global/celo:',
  [gnosis.id]: 'https://app.safe.global/gno:',
  [optimism.id]: 'https://app.safe.global/oeth:',
  [polygonZkEvm.id]: 'https://app.safe.global/zkevm:',
  [zksync.id]: 'https://app.safe.global/zksync:',
};

/**
 * A comprehensive mapping of chain IDs to their corresponding Safe Transaction Service API endpoints.
 * This is used by the `safeTracker` to fetch the status of multisig transactions from the correct service.
 * @type {Record<number, string>}
 */
export const SafeTransactionServiceUrls: Record<number, string> = {
  [mainnet.id]: 'https://safe-transaction-mainnet.safe.global/api/v1',
  [goerli.id]: 'https://safe-transaction-goerli.safe.global/api/v1',
  [sepolia.id]: 'https://safe-transaction-sepolia.safe.global/api/v1',
  [polygon.id]: 'https://safe-transaction-polygon.safe.global/api/v1',
  [arbitrum.id]: 'https://safe-transaction-arbitrum.safe.global/api/v1',
  [aurora.id]: 'https://safe-transaction-aurora.safe.global/api/v1',
  [avalanche.id]: 'https://safe-transaction-avalanche.safe.global/api/v1',
  [base.id]: 'https://safe-transaction-base.safe.global/api/v1',
  [boba.id]: 'https://safe-transaction-boba.safe.global/api/v1',
  [bsc.id]: 'https://safe-transaction-bsc.safe.global/api/v1',
  [celo.id]: 'https://safe-transaction-celo.safe.global/api/v1',
  [gnosis.id]: 'https://safe-transaction-gnosis-chain.safe.global/api/v1',
  [optimism.id]: 'https://safe-transaction-optimism.safe.global/api/v1',
  [polygonZkEvm.id]: 'https://safe-transaction-zkevm.safe.global/api/v1',
  [zksync.id]: 'https://safe-transaction-zksync.safe.global/api/v1',
};
