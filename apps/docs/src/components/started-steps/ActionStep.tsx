import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const codeBlock = `import { Config, writeContract } from '@wagmi/core';
import { sepolia } from 'viem/chains';
import { CounterAbi, COUNTER_ADDRESS } from './';

export async function increment({ wagmiConfig }: { wagmiConfig?: Config }) {
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: CounterAbi, // ABI from previous step
      address: COUNTER_ADDRESS, // Contract address
      functionName: 'increment',
      args: [],
      chainId: sepolia.id,
    });
  }
  return undefined;
}
`;

export function ActionStep() {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 3: Create a Contract Action</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        The next step involves wrapping a smart contract function into a reusable 'action'. This approach makes the
        function compatible with the transaction tracking suite. While this step isn't strictly necessary, creating
        actions is a powerful pattern for simplifying code and avoiding repetition, especially in larger applications.
        This example demonstrates creating an action for the `increment` function:
      </p>
      <CodeBlock title="increment.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" />
      </CodeBlock>
    </div>
  );
}
