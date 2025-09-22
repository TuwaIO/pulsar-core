import { DocumentTextIcon } from '@heroicons/react/24/outline';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const idlContent = `{
  "address": "...your contract address...",
  "version": "0.1.0",
  "name": "solanatest",
  "instructions": [
    {
      "name": "increment",
      "accounts": [
        {
          "name": "solanatest",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
  ],
}
`;

const configContent = `import { createCodamaConfig } from 'gill';

export default createCodamaConfig({
  clientJs: 'src/programs/solanatest/generated',
  idl: 'src/targets/solanatest/idl/solanatest.json',
});
`;

export function IDLStep() {
  return (
    <div>
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 2: Program IDL</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        For Solana, you'll need the Program IDL (Interface Definition Language) for the on-chain program you want to
        interact with. The IDL defines the program's instructions, accounts, and data structures. It serves a similar
        purpose to an EVM ABI.
      </p>
      <CodeBlock title="solanatest.json" titleIcons={<DocumentTextIcon />} textToCopy={idlContent}>
        <CodeHighlighter children={idlContent} language="json" />
      </CodeBlock>
      <h4 className="mb-2 mt-4 text-base font-semibold text-[var(--tuwa-text-primary)]">
        Generating Type-Safe Instructions
      </h4>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        To use the IDL easily and safely, you can generate type-safe instructions. We recommend using the **Codama** CLI
        for this. First, make sure you have it installed:
      </p>
      <CodeBlock title="bash" textToCopy="pnpm add -g codama" titleIcons={<DocumentTextIcon />}>
        <CodeHighlighter children="pnpm add -g codama" language="bash" />
      </CodeBlock>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        Next, configure it to point to your IDL file. Create a `codama.js` file in your project root with the following
        configuration:
      </p>
      <CodeBlock title="codama.js" textToCopy={configContent} titleIcons={<DocumentTextIcon />}>
        <CodeHighlighter children={configContent} language="ts" />
      </CodeBlock>
      <p className="mb-2 mt-4 text-[var(--tuwa-text-secondary)]">
        Now you can run the generation script. It will create a `src/programs/solanatest/generated` directory with all
        the necessary files.
      </p>
      <CodeBlock title="bash" textToCopy="pnpm run codama run js -c ./codama.js" titleIcons={<DocumentTextIcon />}>
        <CodeHighlighter children="pnpm run codama run js -c ./codama.js" language="bash" />
      </CodeBlock>
      <p className="mt-4 text-[var(--tuwa-text-secondary)]">
        Once these files are generated, you can use the typed instructions to build your transactions, which we'll cover
        in the next steps.
      </p>
    </div>
  );
}
