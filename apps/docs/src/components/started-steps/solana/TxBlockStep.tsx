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
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { useSatelliteConnectStore } from '@tuwaio/nova-connect/satellite';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createSolanaClientWithCache } from '@tuwaio/orbit-solana';
import { SolanaConnection } from '@tuwaio/satellite-solana';
import { UiWalletAccount } from '@wallet-standard/react';

import { TxType, usePulsarStore } from '@/hooks/txTrackingHooks';
import { increment } from '@/transactions/actions/increment';

export const TxActionButtonIncrement = () => {
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);

  const activeWalletSolana = activeConnection as SolanaConnection;
  const activeWalletCluster = \`\${OrbitAdapter.SOLANA}:\${activeConnection?.chainId ?? 'devnet'}\`;

  const signer = useWalletAccountTransactionSendingSigner(
    activeWalletSolana.connectedAccount as UiWalletAccount,
    activeWalletCluster
  );

  const handleIncrement = async () => {
    await executeTxAction({
      actionFunction: () =>
        increment({
          client: createSolanaClientWithCache({ rpcUrlOrMoniker: 'devnet' }),
          signer
        }),
      onSuccessCallback: async () => {
        console.log('Incremented');
      },
      params: {
        type: TxType.increment,
        adapter: OrbitAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: activeConnection?.rpcURL,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: 'Increment',
        description: 'Incremented the counter by 1.',
        payload: {
          value: 0, // This would typically be dynamic data
        }
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
