import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const codeBlock = `import { createTxTrackingStore } from '@tuwaio/evm-transactions-tracking';
import { createBoundedUseStore } from '@tuwaio/web3-transactions-tracking-core';
import { sepolia } from 'viem/chains';

import { onSucceedCallbacks, TransactionUnion } from './transactions/onSucceedCallbacks';

// Define a unique name for the Local Storage key to persist the store's state.
const storageName = 'transactions-tracking-storage';

// Create a Zustand store with transaction tracking capabilities.
export const useTxTrackingStore = createBoundedUseStore(
  createTxTrackingStore<TransactionUnion>({
    name: storageName, // The key for persisting data in Local Storage.
    appChains: [sepolia], // The blockchain networks your app supports.
    onSucceedCallbacks, // The callback handler for successful transactions.
  }),
);
`;

export function TxTrackingStoreStep() {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 5: Set Up the Tracking Store</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        Next, we initialize the store. This store is responsible for persisting transaction history and state. By
        default, it uses Local Storage, but it's fully compatible with all{' '}
        <a
          className="text-[var(--tuwa-text-accent)] relative font-semibold after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:bg-[var(--tuwa-bg-accent)] after:transition hover:after:bg-[var(--tuwa-bg-accent-hover)]"
          href="https://zustand.docs.pmnd.rs/integrations/persisting-store-data"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zustand persist middleware options
        </a>
        . The store also includes helpers to simplify web3 interactions, which are detailed in the API documentation.
      </p>
      <CodeBlock title="txTrackingHooks.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" />
      </CodeBlock>
    </div>
  );
}
