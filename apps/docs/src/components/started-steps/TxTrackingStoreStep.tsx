import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const codeBlock = `'use client';

import { createBoundedUseStore, createPulsarStore } from '@tuwaio/pulsar-core';
import { ActionTxKey, evmAdapter, TransactionTracker } from '@tuwaio/pulsar-evm';

// 1. Import your wagmi config and chains
import { appChains, config } from '@/configs/wagmiConfig';

const storageName = 'transactions-tracking-storage';

// 2. Define a typed transaction for the 'increment' action
type IncrementTx = Transaction & {
  type: 'increment';
  payload: {
    value: number; // Example payload: the new value of the counter
  };
};

// Create a union of all possible transaction types
export type TransactionUnion = IncrementTx;

// 3. Create and export the store
export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionTracker, TransactionUnion, ActionTxKey>({
    name: storageName,
    // 4. Pass the wagmi config to the evmAdapter
    adapter: evmAdapter(config, appChains),
  }),
);
`;

export function TxTrackingStoreStep() {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 4: Create the Transaction Store</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        Next, create the central Zustand store that will manage the state of all transactions. This is where the{' '}
        <strong>Pulsar</strong> engine is initialized. The `createPulsarStore` function takes your configuration,
        including the `onSucceedCallbacks` handler and, most importantly, the `evmAdapter`. The adapter is configured by
        passing it your `wagmi` config, linking Pulsar to your app's wallet connection.
      </p>
      <CodeBlock title="txTrackingHooks.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" />
      </CodeBlock>
    </div>
  );
}
