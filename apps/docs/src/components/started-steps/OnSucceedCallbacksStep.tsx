import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const codeBlock = `import { TransactionTracker } from '@tuwaio/evm-transactions-tracking/dist/types';
import { Transaction } from '@tuwaio/web3-transactions-tracking-core/dist/types';

export enum TxType {
  increment = 'increment',
}

// Define a typed transaction for the 'increment' action
type IncrementTx = Transaction<TransactionTracker> & {
  type: TxType.increment;
  payload: {
    value: number; // Example payload: the new value of the counter
  };
};

// Create a union of all possible transaction types
export type TransactionUnion = IncrementTx;

// Define a handler for side-effects after a transaction succeeds
export async function onSucceedCallbacks(tx: TransactionUnion) {
  switch (tx.type) {
    case TxType.increment:
      // Example: Log the new value or update the UI
      console.log(\`Transaction 'increment' succeeded. New counter value: \${tx.payload.value}\`);
      break;
    // Add other cases for different transaction types here
  }
}
`;

export function OnSucceedCallbacksStep() {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 4: Handle Transaction Callbacks</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        To handle logic after a transaction succeeds, you can define typed transactions and a callback handler. This
        allows you to run specific code, like updating your UI or logging, based on the transaction type. This feature
        is optional but highly recommended for managing post-transaction side effects.
      </p>
      <CodeBlock title="onSucceedCallbacks.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" />
      </CodeBlock>
    </div>
  );
}
