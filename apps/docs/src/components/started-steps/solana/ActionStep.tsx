import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CodeBlock, CodeHighlighter } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

const codeBlock = `import { address, type TransactionSendingSigner } from '@solana/kit';
import type { SolanaClient } from '@tuwaio/orbit-solana';
import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';

import { getIncrementInstruction } from '@/programs';

const PROGRAM_ADDRESS = address('<your program address>');
const COUNTER_ACCOUNT = address('<your counter account>');

// Returns the transaction signature, which Pulsar uses as the txKey.
export function increment({ client, signer }: { client: SolanaClient; signer: TransactionSendingSigner }) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getIncrementInstruction({ solanatest: COUNTER_ACCOUNT }, { programAddress: PROGRAM_ADDRESS }),
  });
}
`;

export function ActionStep() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 3: Create a Program Action</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        An action is a function that asks the wallet to sign and send the transaction and returns its signature. Pulsar
        calls it inside `executeTxAction` and tracks the transaction under the returned signature. `signAndSendSolanaTx`
        builds a version 0 transaction from the generated instruction, with the signer as fee payer and the latest
        blockhash:
      </p>
      <CodeBlock title="increment.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>
    </div>
  );
}
