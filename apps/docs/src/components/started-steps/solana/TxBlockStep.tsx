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

import { useWalletAccountTransactionSendingSigner } from '@solana/react';
${importLine}
import { useSatelliteConnectStore } from '@tuwaio/nova-connect/satellite';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createSolanaClientWithCache } from '@tuwaio/orbit-solana';
import type { SolanaConnection } from '@tuwaio/satellite-solana';
import type { UiWalletAccount } from '@wallet-standard/ui-core';

import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { increment } from '@/transactions/actions/increment';

function IncrementButton({ account, cluster, rpcUrl }: { account: UiWalletAccount; cluster: string; rpcUrl: string }) {
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const signer = useWalletAccountTransactionSendingSigner(account, \`solana:\${cluster}\`);

  const handleIncrement = async () => {
    try {
      await executeTxAction({
        actionFunction: () => increment({ client: createSolanaClientWithCache({ rpcUrlOrMoniker: rpcUrl }), signer }),
        params: {
          type: 'increment',
          adapter: OrbitAdapter.SOLANA,
          desiredChainID: cluster, // the cluster moniker of the connection, e.g. 'devnet'
          rpcUrl, // saved with the transaction, so tracking resumes on the same RPC after a reload
          title: ['Incrementing', 'Incremented', 'Increment failed', 'Increment replaced'],
          description: 'Increment the counter by 1.',
          payload: { value: 1 },
          withTrackedModal: true, // opens the tracking modal of Nova Transactions
        },
        onSuccess: (tx) => console.log('Finalized in slot', tx.slot),
      });
    } catch (error) {
      // Rejected signature, wrong cluster, failed preflight... Also saved in \`initialTx.error\`.
      console.error(error);
    }
  };

  return (
    <button type="button" onClick={handleIncrement}>
      Increment
    </button>
  );
}

export const Increment = () => {
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection) as SolanaConnection | undefined;

  return (
    <div className="flex flex-col items-start gap-4">
      ${buttonLine}
      {activeConnection?.isConnected && activeConnection.connectedAccount && (
        <IncrementButton
          account={activeConnection.connectedAccount}
          cluster={String(activeConnection.chainId)}
          rpcUrl={activeConnection.rpcURL}
        />
      )}
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
          description and payload, checks that the wallet is on the cluster in `desiredChainID` (it does not switch
          clusters), runs `beforeTxProcess`, calls the action, adds the transaction to the pool and polls its signature
          until it is finalized. The signer comes from `@solana/react`, for the Wallet Standard account of the Satellite
          Connect connection. A `beforeTxProcess` passed to `executeTxAction` replaces the global one for that
          transaction.
        </p>
        <CodeBlock title="Increment.tsx" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
          <CodeHighlighter children={codeBlock} language="tsx" resolvedTheme={resolvedTheme ?? 'light'} />
        </CodeBlock>
      </div>
    </>
  );
}
