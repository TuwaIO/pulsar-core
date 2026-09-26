/**
 * @file Safe (formerly Gnosis Safe) constants: Safe Apps SDK options, Safe web app URLs and Safe Transaction Service
 * endpoints by chain.
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
 * Options for the Safe Apps SDK (`@safe-global/safe-apps-sdk`), for apps that run inside the Safe web app. Pulsar does
 * not use them itself.
 */
export const safeSdkOptions = {
  /** Domains of Safe web apps the SDK accepts messages from. */
  allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /metissafe.tech$/],
  /** Whether the SDK logs debug messages. */
  debug: false,
};

/**
 * Safe web app URL prefixes by chain ID, such as `https://app.safe.global/eth:`. The Safe address follows the prefix.
 * Used by {@link selectEvmTxExplorerLink} to link Safe transactions.
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
 * Safe Transaction Service API base URLs by chain ID. {@link safeFetcher} uses them; chains that are not listed cannot be
 * tracked with the Safe tracker.
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
