'use client';

import { Tabs } from 'nextra/components';

import { NovaConnect } from '@/components/started-blocks/solana/NovaConnect';

const walletConnectorsSolana = [
  {
    name: 'Nova Connect',
    component: <NovaConnect />,
  },
];

export function StartedWrapperSolana() {
  return (
    <div className="mt-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[var(--tuwa-text-primary)]">
          Choose your preferred wallet connector:
        </h3>
        <Tabs items={walletConnectorsSolana.map((c) => c.name)}>
          {walletConnectorsSolana.map((connector) => (
            <Tabs.Tab key={connector.name}>{connector.component}</Tabs.Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
