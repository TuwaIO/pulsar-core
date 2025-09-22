'use client';

import { Tabs } from 'nextra/components';

import { ConnectKit } from '@/components/started-blocks/evm/ConnectKit';
import { RainbowKit } from '@/components/started-blocks/evm/RainbowKit';

const walletConnectorsEvm = [
  {
    name: 'RainbowKit',
    component: <RainbowKit />,
  },
  {
    name: 'ConnectKit',
    component: <ConnectKit />,
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
