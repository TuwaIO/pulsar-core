import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const codeBlockCreateHook = `'use client';

import { ITxTrackingStore } from '@tuwaio/pulsar-core';
import { createContext, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';

import { TransactionUnion } from '@/providers/PulsarProvider';

type PulsarStore = ITxTrackingStore<TransactionUnion>;

export const PulsarStoreContext = createContext<StoreApi<PulsarStore> | null>(null);

export const usePulsarStore = <T>(selector: (state: PulsarStore) => T): T => {
  const store = useContext(PulsarStoreContext);
  if (!store) {
    throw new Error('usePulsarStore must be used within a PulsarProvider');
  }
  return useStore(store, selector);
};
`;

const codeBlockCreateProvider = `'use client';

import { createPulsarStore, Transaction } from '@tuwaio/pulsar-core';
import { solanaAdapter } from '@tuwaio/pulsar-solana';
import { useWalletUi } from '@wallet-ui/react';
import { PropsWithChildren, useMemo } from 'react';

import { PulsarStoreContext } from '@/hooks/txTrackingHooks';

const storageName = 'transactions-tracking-storage';

// 2. Define a typed transaction for the 'increment' action
type IncrementTx = Transaction & {
  type: 'increment';
  payload: {
    value: number; // Example payload: the new value of the counter
  };
};

// Create a union of all possible transaction types
export type TransactionUnion = IncrementTx;

export function PulsarProvider({ children }: PropsWithChildren) {
  const wallet = useWalletUi();

  const store = useMemo(() => {
    return createPulsarStore<TransactionUnion>({
      name: storageName,
      adapter: solanaAdapter({
        wallet: {
          walletAddress: wallet?.account?.address.toString() ?? '',
          walletType: wallet?.account?.label ?? 'solana',
          walletActiveChain: wallet?.cluster.cluster ?? 'mainnet',
        },
        rpcUrls: {
          devnet: 'https://api.devnet.solana.com',
        },
      }),
    });
  }, [wallet]);

  return <PulsarStoreContext.Provider value={store}>{children}</PulsarStoreContext.Provider>;
}
`;

export function TxTrackingStoreStep() {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 4: Create the Transaction Store</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        Next, we'll create the central store that manages the state of all transactions. For convenience, it is a common
        pattern to wrap the store in a React Context Provider and create a custom hook to access it. This is where the
        core <b>Pulsar</b> engine is initialized by linking it to your application's wallet state.
      </p>
      <CodeBlock title="txTrackingHooks.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlockCreateHook}>
        <CodeHighlighter children={codeBlockCreateHook} language="ts" />
      </CodeBlock>
      <p className="my-2 text-[var(--tuwa-text-secondary)]">
        The <i>PulsarProvider.tsx</i> file below shows how the <i>createPulsarStore</i> function is called with the
        <i>solanaAdapter</i>. The adapter is configured by getting the wallet, active chain, and other necessary
        information from the <i>@wallet-ui/react</i> library, linking Pulsar to your app's Solana wallet connection.
      </p>
      <CodeBlock title="PulsarProvider.tsx" titleIcons={<DocumentTextIcon />} textToCopy={codeBlockCreateProvider}>
        <CodeHighlighter children={codeBlockCreateProvider} language="ts" />
      </CodeBlock>
    </div>
  );
}
