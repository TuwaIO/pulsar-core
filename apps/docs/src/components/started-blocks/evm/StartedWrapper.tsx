'use client';

import { Tabs } from 'nextra/components';

import { NovaConnect } from '@/components/started-blocks/evm/NovaConnect';

const walletConnectorsEvm = [
  {
    name: 'Nova Connect',
    component: <NovaConnect />,
  },
];

export function StartedWrapperEvm() {
  return (
    <div className="mt-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[var(--tuwa-text-primary)]">
          Choose your preferred wallet connector:
        </h3>
        <Tabs items={walletConnectorsEvm.map((c) => c.name)}>
          {walletConnectorsEvm.map((connector) => (
            <Tabs.Tab key={connector.name}>{connector.component}</Tabs.Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
