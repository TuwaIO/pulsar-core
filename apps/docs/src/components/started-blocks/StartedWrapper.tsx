'use client';

import { Tabs } from 'nextra/components';

import { ConnectKit } from '@/components/started-blocks/ConnectKit';
import { Dynamic } from '@/components/started-blocks/Dynamic';
import { RainbowKit } from '@/components/started-blocks/RainbowKit';

const walletConnectors = [
  {
    name: 'RainbowKit',
    component: <RainbowKit />,
  },
  {
    name: 'ConnectKit',
    component: <ConnectKit />,
  },
  {
    name: 'Dynamic.xyz',
    component: <Dynamic />,
  },
];

export function StartedWrapper() {
  return (
    <div className="mt-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-[var(--tuwa-text-primary)]">
          Choose your preferred wallet connector:
        </h3>
        <Tabs items={walletConnectors.map((c) => c.name)}>
          {walletConnectors.map((connector) => (
            <Tabs.Tab key={connector.name}>{connector.component}</Tabs.Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
