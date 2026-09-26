import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CodeBlock, CodeHighlighter } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

const codeBlock = `'use client';

import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';

import { usePulsarStore } from '@/hooks/txTrackingHooks';

// Render once, in a component that stays mounted (for example next to your providers in the root layout).
export function PulsarInitializer() {
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);

  // Restarts the trackers of transactions that were pending before a page reload.
  useInitializeTransactionsPool({ initializeTransactionsPool });

  return null;
}
`;

/**
 * Step of the Getting Started guide that restores tracking after a reload. Shared by the EVM and Solana tabs.
 */
export function PulsarInitializerStep() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 5: Resume Tracking After a Reload</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        The store restores its transactions from `localStorage`, but the trackers are not running after a reload.
        `useInitializeTransactionsPool` from `@tuwaio/pulsar-react` starts them again for every pending transaction.
        Each call starts new trackers, so render this component only once.
      </p>
      <CodeBlock title="PulsarInitializer.tsx" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="tsx" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>
    </div>
  );
}
