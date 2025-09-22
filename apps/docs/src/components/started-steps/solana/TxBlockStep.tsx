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
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import {
  UiWalletAccount,
  useWalletAccountTransactionSendingSigner,
  useWalletUi,
} from '@wallet-ui/react';
import { address } from 'gill';

import { TxType } from '@/providers/PulsarProvider';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { increment } from '@/transactions/actions/increment';

export const TxActionButtonIncrement = () => {
  const walletUi = useWalletUi();
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);

  const signer = useWalletAccountTransactionSendingSigner(walletUi.account as UiWalletAccount, walletUi.cluster.id);

  const handleIncrement = async () => {
    await handleTransaction({
      actionFunction: () => increment({ client: walletUi.client, signer, solanatest: address('__YOUR_SOLANATEST_ADDRESS_HERE__') }),
      onSuccessCallback: async () => {
        console.log('Incremented');
      },
      params: {
        type: TxType.increment,
        adapter: TransactionAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: walletUi.cluster.urlOrMoniker,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
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
