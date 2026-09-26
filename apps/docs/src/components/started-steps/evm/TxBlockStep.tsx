import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CodeBlock, CodeHighlighter } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

import { PulsarInitializerStep } from '@/components/started-steps/PulsarInitializerStep';

export interface TxBlockStepCodeGenerateParams {
  importLine: string;
  buttonLine: string;
}

const txBlockStepCodeGenerate = ({ importLine, buttonLine }: TxBlockStepCodeGenerateParams) => {
  return `'use client';

${importLine}
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { TransactionTracker } from '@tuwaio/pulsar-core';
import { sepolia } from 'viem/chains';

import { wagmiConfig } from '@/configs/wagmiConfig';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { increment } from '@/transactions/actions/increment';
import { incrementWithSmartAccount } from '@/transactions/actions/incrementWithSmartAccount';

const pimlicoApiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;

export const Increment = () => {
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const pendingCount = usePulsarStore(
    (state) => Object.values(state.transactionsPool).filter((tx) => tx.pending).length,
  );

  const handleIncrement = async () => {
    try {
      await executeTxAction({
        actionFunction: () => increment({ wagmiConfig }),
        params: {
          type: 'increment',
          adapter: OrbitAdapter.EVM,
          desiredChainID: sepolia.id, // the wallet is asked to switch to Sepolia if needed
          title: ['Incrementing', 'Incremented', 'Increment failed', 'Increment replaced'],
          description: 'Increment the counter by 1.',
          payload: { value: 1 },
          withTrackedModal: true, // opens the tracking modal of Nova Transactions
        },
        onSuccess: (tx) => console.log('Incremented in', tx.hash),
      });
    } catch (error) {
      // Rejected signature, declined network switch, failed preflight... Also saved in \`initialTx.error\`.
      console.error(error);
    }
  };

  const handleIncrementWithSmartAccount = async () => {
    try {
      await executeTxAction({
        actionFunction: () => incrementWithSmartAccount({ wagmiConfig, pimlicoApiKey }),
        params: {
          type: 'increment',
          adapter: OrbitAdapter.EVM,
          desiredChainID: sepolia.id,
          title: 'Increment with a smart account',
          payload: { value: 1 },
          tracker: TransactionTracker.ERC4337, // required: UserOperations are not detected automatically
          pimlicoApiKey, // saved with the transaction to resume tracking after a reload
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      ${buttonLine}
      <button type="button" onClick={handleIncrement}>
        Increment
      </button>
      <button type="button" onClick={handleIncrementWithSmartAccount}>
        Increment with a smart account
      </button>
      {pendingCount > 0 && <p>{pendingCount} pending transaction(s)</p>}
    </div>
  );
};
`;
};

export function TxBlockStep({ importLine, buttonLine }: TxBlockStepCodeGenerateParams) {
  const { resolvedTheme } = useTheme();
  const codeBlock = txBlockStepCodeGenerate({ importLine, buttonLine });

  return (
    <>
      <PulsarInitializerStep />
      <div className="mt-4">
        <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 6: Trigger the Transaction</h3>
        <p className="mb-2 text-[var(--tuwa-text-secondary)]">
          Call `executeTxAction` with the action and the metadata of the transaction. Pulsar validates the title,
          description and payload, switches the wallet to `desiredChainID`, runs `beforeTxProcess`, calls the action,
          adds the transaction to the pool and starts its tracker; from then on the store updates the status on its own.
          Components read the state with selectors, so it stays correct after navigation or a reload. For standard EVM
          transactions the promise resolves only after tracking has finished, so render the status from the store rather
          than from the promise. A `beforeTxProcess` passed to `executeTxAction` replaces the global one for that
          transaction.
        </p>
        <CodeBlock title="Increment.tsx" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
          <CodeHighlighter children={codeBlock} language="tsx" resolvedTheme={resolvedTheme ?? 'light'} />
        </CodeBlock>
      </div>
    </>
  );
}
