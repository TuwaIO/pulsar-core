import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const codeBlock = `import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';
import { Address, SolanaClient, TransactionSendingSigner } from 'gill';

import { getIncrementInstruction } from '@/programs';

export function increment({ client, signer, solanatest }: {
  client: SolanaClient;
  signer: TransactionSendingSigner;
  incrementContractAddress: Address;
}) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getIncrementInstruction({ solanatest: incrementContractAddress }, { programAddress: "__your program address__" }),
  });
}
`;

export function ActionStep() {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 3: Create a Program Action</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        The next step involves wrapping a program instruction into a reusable 'action'. This approach makes the function
        compatible with the <b>Pulsar</b> engine. While this step isn't strictly necessary, creating actions is a
        powerful pattern for simplifying code and avoiding repetition, especially in larger applications. This example
        demonstrates creating an action for the `increment` function:
      </p>
      <CodeBlock title="increment.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" />
      </CodeBlock>
    </div>
  );
}
