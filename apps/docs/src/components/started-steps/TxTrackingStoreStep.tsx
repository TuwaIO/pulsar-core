import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const codeBlock = `'use client';

import { createBoundedUseStore, createPulsarStore } from '@tuwaio/pulsar-core';
import { ActionTxKey, evmAdapter, TransactionTracker } from '@tuwaio/pulsar-evm';

// 1. Import your wagmi config and chains
import { appChains, config } from '@/configs/wagmiConfig';
// 2. Import your typed callbacks from the previous step
import { onSucceedCallbacks, TransactionUnion } from '@/transactions/onSucceedCallbacks';

const storageName = 'transactions-tracking-storage';

// 3. Create and export the store
export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionTracker, TransactionUnion, ActionTxKey>({
    name: storageName,
    onSucceedCallbacks,
    // 4. Pass the wagmi config to the evmAdapter
    adapters: [evmAdapter(config, appChains)],
  }),
);
`;

export function TxTrackingStoreStep() {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 5: Create the Transaction Store</h3>
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
