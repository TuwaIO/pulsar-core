import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const codeBlock = `export const CounterAbi = [
  {
    inputs: [],
    name: 'decrement',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'increment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
`;

export function ABIStep() {
  return (
    <div>
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 2: Contract ABI</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        You'll need the Application Binary Interface (ABI) for the smart contract you wish to interact with. The ABI
        defines the contract's methods and structures. For this demonstration, we will use the ABI from a standard
        Counter contract.
      </p>
      <CodeBlock title="CounterAbi.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" />
      </CodeBlock>
    </div>
  );
}
