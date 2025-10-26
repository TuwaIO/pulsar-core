import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const codeBlockCreateHook = `
import { createBoundedUseStore, createPulsarStore, Transaction } from '@tuwaio/pulsar-core';
import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';

import { solanaRPCUrls } from '@/configs/appConfig';

const storageName = 'transactions-tracking-storage';

export enum TxType {
  increment = 'increment',
}

type IncrementTx = Transaction & {
  type: TxType.increment;
  payload: {
    value: number;
  };
};

export type TransactionUnion = IncrementTx;

export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionUnion>({
    name: storageName,
    adapter: pulsarSolanaAdapter({
      rpcUrls: solanaRPCUrls,
    }),
  }),
);
`;

export function TxTrackingStoreStep() {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 4: Create the Transaction Store</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        Next, create the central Zustand store that will manage the state of all transactions. This is where the{' '}
        <strong>Pulsar</strong> engine is initialized. The `createPulsarStore` function takes your configuration. The
        adapter is configured by passing it your `solanaRPCUrls` config, linking Pulsar to your app's solana rpc urls
        config.
      </p>
      <CodeBlock title="txTrackingHooks.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlockCreateHook}>
        <CodeHighlighter children={codeBlockCreateHook} language="ts" />
      </CodeBlock>
    </div>
  );
}
