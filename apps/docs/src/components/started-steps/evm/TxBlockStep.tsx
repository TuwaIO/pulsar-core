import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

export interface TxBlockStepCodeGenerateParams {
  importLine: string;
  buttonLine: string;
}

const txBlockStepCodeGenerate = ({ importLine, buttonLine }: TxBlockStepCodeGenerateParams) => {
  return `'use client';

${importLine}
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { sepolia } from 'viem/chains';

// The wagmi config is needed by the action function itself
import { config } from '@/configs/wagmiConfig';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { increment } from '@/transactions/actions/increment';

export const Increment = () => {
  const initializeTransactionsPool = usePulsarStore(state => state.initializeTransactionsPool);
  const handleTransaction = usePulsarStore(state => state.handleTransaction);

  // This hook ensures that transaction tracking continues even after a page reload.
  useInitializeTransactionsPool(initializeTransactionsPool);

  const handleIncrement = async () => {
    await handleTransaction({
      // The actionFunction needs the config to interact with the wallet/contract.
      actionFunction: () => increment({ wagmiConfig: config }),
      // Params describe the transaction for the Pulsar store.
      params: {
        type: 'increment',
        adapter: TransactionAdapter.EVM,
        desiredChainID: sepolia.id,
        payload: {
          value: 0, // This would typically be dynamic data
        },
      },
    });
  };

  return (
    <div className="flex flex-col items-start">
      ${buttonLine}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleIncrement}
          className="rounded-md bg-[var(--tuwa-bg-accent)] px-4 py-2 font-semibold text-white hover:bg-[var(--tuwa-bg-accent-hover)]"
        >
          Increment
        </button>
      </div>
    </div>
  );
};
`;
};

export function TxBlockStep({ importLine, buttonLine }: TxBlockStepCodeGenerateParams) {
  const codeBlock = txBlockStepCodeGenerate({ importLine, buttonLine });

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 5: Trigger the Transaction</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        Finally, create a component to trigger the transaction. When a user clicks 'Increment,' the `handleTransaction`
        function orchestrates the entire process. It dispatches the transaction, adds it to the pool, and from this
        point on, the <b>Pulsar</b> engine automatically handles all status updates.
      </p>
      <CodeBlock title="Increment.tsx" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="tsx" />
      </CodeBlock>
    </div>
  );
}
