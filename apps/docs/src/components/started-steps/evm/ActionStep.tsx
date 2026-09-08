import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CodeBlock, CodeHighlighter } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

const codeBlock = `import { Config, writeContract } from '@wagmi/core';
import { sepolia } from 'viem/chains';
import { CounterAbi, COUNTER_ADDRESS } from './';

export async function increment({ wagmiConfig }: { wagmiConfig?: Config }) {
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: CounterAbi, // ABI from previous step
      address: COUNTER_ADDRESS, // Contract address (0xAe7f46914De82028eCB7E2bF97Feb3D3dDCc2BAB: sepolia testenet for example)
      functionName: 'increment',
      args: [],
      chainId: sepolia.id,
    });
  }
  return undefined;
}
`;

const smartAccountCodeBlock = `import { createPimlicoSmartAccountClient } from '@tuwaio/orbit-evm';
import { encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { CounterAbi, COUNTER_ADDRESS } from './';
import type { Config } from '@wagmi/core';

export async function incrementWithSmartAccount({
  wagmiConfig,
  apiKey,
}: {
  wagmiConfig?: Config;
  apiKey?: string;
}) {
  if (!wagmiConfig) return undefined;

  // 1. Initialize Solady smart account with Pimlico paymaster sponsorship via Orbit
  const { account, bundlerClient } = await createPimlicoSmartAccountClient({
    chain: sepolia,
    wagmiConfig,
    apiKey: apiKey ?? process.env.NEXT_PUBLIC_PIMLICO_API_KEY,
    sponsor: true,
  });

  // 2. Dispatch UserOperation via Pimlico Bundler
  const userOpHash = await bundlerClient.sendUserOperation({
    account,
    calls: [
      {
        to: COUNTER_ADDRESS,
        data: encodeFunctionData({
          abi: CounterAbi,
          functionName: 'increment',
          args: [],
        }),
      },
    ],
  });

  // 3. Return userOpHash; Pulsar automatically tracks it via Two-Stage ERC-4337 pipeline
  return userOpHash;
}
`;

export function ActionStep() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 3: Create a Contract Action</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        The next step involves wrapping a smart contract function into a reusable 'action'. This approach makes the
        function compatible with the <b>Pulsar</b> engine. While this step isn't strictly necessary, creating actions is
        a powerful pattern for simplifying code and avoiding repetition, especially in larger applications. This example
        demonstrates creating a standard baseline action for the `increment` function:
      </p>
      <CodeBlock title="increment.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>

      <h4 className="mb-2 mt-4 text-base font-semibold text-[var(--tuwa-text-primary)]">
        Alternative: ERC-4337 Smart Account Action via Pimlico
      </h4>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        As an optional companion pattern for Account Abstraction, you can dispatch actions through a Solady smart
        account orchestrated by Pimlico. Pulsar automatically detects the returned `userOpHash` and runs the Two-Stage
        tracking pipeline:
      </p>
      <CodeBlock
        title="incrementWithSmartAccount.ts"
        titleIcons={<DocumentTextIcon />}
        textToCopy={smartAccountCodeBlock}
      >
        <CodeHighlighter children={smartAccountCodeBlock} language="ts" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>
    </div>
  );
}
