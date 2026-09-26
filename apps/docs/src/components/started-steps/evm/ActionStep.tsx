import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CodeBlock, CodeHighlighter } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

const codeBlock = `import { type Config, writeContract } from '@wagmi/core';
import { sepolia } from 'viem/chains';

import { COUNTER_ADDRESS, CounterAbi } from '@/abis/CounterAbi';

// Returns the transaction hash, which Pulsar uses as the txKey.
export function increment({ wagmiConfig }: { wagmiConfig: Config }) {
  return writeContract(wagmiConfig, {
    abi: CounterAbi,
    address: COUNTER_ADDRESS,
    functionName: 'increment',
    chainId: sepolia.id,
  });
}
`;

const smartAccountCodeBlock = `import { createPimlicoSmartAccountClient } from '@tuwaio/orbit-evm';
import type { Config } from '@wagmi/core';
import { encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';

import { COUNTER_ADDRESS, CounterAbi } from '@/abis/CounterAbi';

// Returns the userOpHash, which Pulsar uses as the txKey.
export async function incrementWithSmartAccount({
  wagmiConfig,
  pimlicoApiKey,
}: {
  wagmiConfig: Config;
  pimlicoApiKey?: string;
}) {
  // A Solady smart account owned by the connected wallet, sent through the Pimlico bundler.
  // With an API key, gas is sponsored by the Pimlico paymaster by default.
  const { account, bundlerClient } = await createPimlicoSmartAccountClient({
    chain: sepolia,
    wagmiConfig,
    apiKey: pimlicoApiKey,
  });

  return bundlerClient.sendUserOperation({
    account,
    calls: [
      {
        to: COUNTER_ADDRESS,
        data: encodeFunctionData({ abi: CounterAbi, functionName: 'increment' }),
      },
    ],
  });
}
`;

export function ActionStep() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 3: Create a Contract Action</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        An action is a function that asks the wallet to sign and submit the transaction and returns its key. Pulsar
        calls it inside `executeTxAction` and tracks the transaction under the returned key. Keeping actions in their
        own files lets you reuse them from several components:
      </p>
      <CodeBlock title="increment.ts" titleIcons={<DocumentTextIcon />} textToCopy={codeBlock}>
        <CodeHighlighter children={codeBlock} language="ts" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>

      <h4 className="mt-4 mb-2 text-base font-semibold text-[var(--tuwa-text-primary)]">
        Optional: ERC-4337 Smart Account Action via Pimlico
      </h4>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        With `@tuwaio/orbit-evm` you can send the same call as a UserOperation from a Solady smart account. The action
        returns the `userOpHash`. Pulsar does not detect UserOperations on its own: pass `tracker:
        TransactionTracker.ERC4337` and your `pimlicoApiKey` (or `bundlerUrl`) in the transaction params, as shown in
        Step 5. Pulsar then tracks it in two stages: the bundler until the UserOperation is included, then the bundle
        transaction on-chain.
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
