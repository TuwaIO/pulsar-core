import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CodeBlock, CodeHighlighter } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

const codeBlock = `'use client';

import { createBoundedUseStore, createPulsarStore, type EvmTransaction } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';

// Your wagmi config and viem chains, from the wallet connector setup
import { appChains, wagmiConfig } from '@/configs/wagmiConfig';

// Typed transactions of your app
type IncrementTx = EvmTransaction & {
  type: 'increment';
  payload: {
    value: number;
  };
};

export type TransactionUnion = IncrementTx;

export const pulsarStore = createPulsarStore<TransactionUnion>({
  name: 'transactions-tracking-storage', // localStorage key
  adapter: pulsarEvmAdapter(wagmiConfig, appChains),
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
        Create the store once, in a client module. `createPulsarStore` connects Pulsar to your wagmi config through
        `pulsarEvmAdapter` and saves the transactions to `localStorage` under `name`. `createBoundedUseStore` turns the
        vanilla store into a React hook.
      </p>
      <CodeBlock title="txTrackingHooks.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>
    </div>
  );
}
