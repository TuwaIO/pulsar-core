'use client';

import { CommandLineIcon } from '@heroicons/react/24/outline';
import { Tabs } from 'nextra/components';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

export interface PackageInstallationTabsProps {
  trackingPackageName: string;
}

const tabsItems = [
  {
    title: 'npm',
    command: 'npm install',
  },
  {
    title: 'yarn',
    command: 'yarn add',
  },
  {
    title: 'pnpm',
    command: 'pnpm add',
  },
  {
    title: 'bun',
    command: 'bun add',
  },
];

export function PackageInstallationTabs({ trackingPackageName }: PackageInstallationTabsProps) {
  const packages = `@tuwaio/web3-transactions-tracking-core @tuwaio/${trackingPackageName}`;

  return (
    <div className="my-4">
      <Tabs items={tabsItems.map((tab) => tab.title)}>
        {tabsItems.map((tab) => (
          <Tabs.Tab key={tab.title}>
            <CodeBlock title="Terminal" titleIcons={<CommandLineIcon />} textToCopy={`${tab.command} ${packages}`}>
              <CodeHighlighter language="bash">{`${tab.command} ${packages}`}</CodeHighlighter>
            </CodeBlock>
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  );
}
