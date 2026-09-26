import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CodeBlock, CodeHighlighter } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

const codeBlockCreateHook = `'use client';

import { createBoundedUseStore, createPulsarStore, type SolanaTransaction } from '@tuwaio/pulsar-core';
import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';

// Your RPC URLs by cluster, for example { devnet: 'https://api.devnet.solana.com' }
import { solanaRPCUrls } from '@/configs/appConfig';

// Typed transactions of your app
type IncrementTx = SolanaTransaction & {
  type: 'increment';
  payload: {
    value: number;
  };
};

export type TransactionUnion = IncrementTx;

export const pulsarStore = createPulsarStore<TransactionUnion>({
  name: 'transactions-tracking-storage', // localStorage key
  adapter: pulsarSolanaAdapter({ rpcUrls: solanaRPCUrls }),
  // Optional preflight, run before the wallet is asked to sign. Throw to block the transaction.
  beforeTxProcess: () => {
    if (!navigator.onLine) throw new Error('You are offline.');
  },
});

export const usePulsarStore = createBoundedUseStore(pulsarStore);
`;

export function TxTrackingStoreStep() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 4: Create the Transaction Store</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        Create the store once, in a client module. `createPulsarStore` connects Pulsar to your Solana setup through
        `pulsarSolanaAdapter` and saves the transactions to `localStorage` under `name`. `createBoundedUseStore` turns
        the vanilla store into a React hook.
      </p>
      <CodeBlock title="txTrackingHooks.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlockCreateHook}>
        <CodeHighlighter children={codeBlockCreateHook} language="ts" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>
    </div>
  );
}
