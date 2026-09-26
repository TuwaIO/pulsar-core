import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { CodeBlock, CodeHighlighter } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

const idlContent = `{
  "address": "<your program address>",
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
    }
  ]
}
`;

const configContent = `{
  "idl": "src/targets/solanatest/idl/solanatest.json",
  "scripts": {
    "js": {
      "from": "@codama/renderers-js",
      "args": [
        "src/programs/solanatest/generated",
        {
          "generatedFolder": "",
          "syncPackageJson": false,
          "deleteFolderBeforeRendering": true,
          "kitImportStrategy": "rootOnly"
        }
      ]
    }
  }
}
`;

export function IDLStep() {
  const { resolvedTheme } = useTheme();
  return (
    <div>
      <h3 className="mb-2 text-lg font-bold text-[var(--tuwa-text-primary)]">Step 2: Program IDL</h3>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        You need the IDL (Interface Definition Language file) of the program you want to call: it describes the
        program's instructions and accounts, like an ABI on EVM. This guide uses a counter program named `solanatest`
        whose `increment` instruction takes the counter account.
      </p>
      <CodeBlock title="solanatest.json" titleIcons={<DocumentTextIcon />} textToCopy={idlContent}>
        <CodeHighlighter children={idlContent} language="json" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>
      <h4 className="mb-2 mt-4 text-base font-semibold text-[var(--tuwa-text-primary)]">
        Generating Type-Safe Instructions
      </h4>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        To use the IDL easily and safely, you can generate type-safe instructions. We recommend using the **Codama CLI**
        (`@codama/cli`) for this. First, install the CLI and the JavaScript/Solana Kit renderer:
      </p>
      <CodeBlock
        title="bash"
        textToCopy="pnpm add -D @codama/cli @codama/renderers-js"
        titleIcons={<DocumentTextIcon />}
      >
        <CodeHighlighter
          children="pnpm add -D @codama/cli @codama/renderers-js"
          language="bash"
          resolvedTheme={resolvedTheme ?? 'light'}
        />
      </CodeBlock>
      <p className="mb-2 text-[var(--tuwa-text-secondary)]">
        Next, configure it to point to your IDL file and output directory. Create a `codama.json` configuration file in
        your project root:
      </p>
      <CodeBlock title="codama.json" textToCopy={configContent} titleIcons={<DocumentTextIcon />}>
        <CodeHighlighter children={configContent} language="json" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>
      <p className="mb-2 mt-4 text-[var(--tuwa-text-secondary)]">
        Now run the generation command. It creates `src/programs/solanatest/generated` with typed instruction builders
        for `@solana/kit`; re-export them from `src/programs/index.ts` to import them as `@/programs`:
      </p>
      <CodeBlock title="bash" textToCopy="pnpm exec codama run js" titleIcons={<DocumentTextIcon />}>
        <CodeHighlighter children="pnpm exec codama run js" language="bash" resolvedTheme={resolvedTheme ?? 'light'} />
      </CodeBlock>
      <p className="mt-4 text-[var(--tuwa-text-secondary)]">
        Once these files are generated, you can use the typed instructions to build your transactions, which we'll cover
        in the next steps.
      </p>
    </div>
  );
}
