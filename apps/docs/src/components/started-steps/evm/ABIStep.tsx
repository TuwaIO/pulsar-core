import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CodeBlock, CodeHighlighter } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

const codeBlock = `// A Counter contract deployed on Sepolia.
export const COUNTER_ADDRESS = '0xAe7f46914De82028eCB7E2bF97Feb3D3dDCc2BAB';

export const CounterAbi = [
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
  const { resolvedTheme } = useTheme();
  return (
    <div>
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 2: Contract ABI</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        You need the address and the ABI (Application Binary Interface) of the contract you want to call. This guide
        uses a simple Counter contract deployed on Sepolia.
      </p>
      <CodeBlock title="CounterAbi.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>
    </div>
  );
}
