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
import { useInitializeTransactionsPool } from '@tuwaio/evm-transactions-tracking';
import { sepolia } from 'viem/chains';

import { config } from '@/configs/wagmiConfig';
import { useTxTrackingStore } from '@/hooks/txTrackingHooks';
import { increment } from '@/transactions/actions/increment';
import { TxType } from '@/transactions/onSucceedCallbacks';

export const Increment = () => {
  const initializeTransactionsPool = useTxTrackingStore(state => state.initializeTransactionsPool);
  const handleTransaction = useTxTrackingStore(state => state.handleTransaction);
  // This hook ensures that transaction tracking continues even after a page reload.
  useInitializeTransactionsPool(initializeTransactionsPool);

  const handleIncrement = async () => {
    await handleTransaction({
      config,
      actionFunction: () => increment({ wagmiConfig: config }),
      params: {
        type: TxType.increment,
        desiredChainID: sepolia.id,
        // The payload would typically contain dynamic data relevant to the transaction.
        payload: {
          value: 0,
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
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 6: Trigger the Transaction</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        Finally, a component is created with a wallet connection button and another button to trigger the transaction.
        When a user clicks 'Increment,' the transaction is dispatched and immediately tracked in the transaction pool.
        From this point on, the tracking suite automatically handles all status updates.
      </p>
      <CodeBlock title="Increment.tsx" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="tsx" />
      </CodeBlock>
    </div>
  );
}
