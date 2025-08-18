'use client';

import { Tabs } from 'nextra/components';

import { ConnectKit } from '@/components/started-blocks/ConnectKit';
import { Dynamic } from '@/components/started-blocks/Dynamic';
import { RainbowKit } from '@/components/started-blocks/RainbowKit';

export const trackingPackages = [
  {
    name: 'EVM',
    packageName: 'evm-transactions-tracking',
  },
];

const walletConnectors = [
  {
    name: 'Dynamic.xyz',
    component: <Dynamic trackingPackageName={trackingPackages[0].packageName} />,
  },
  {
    name: 'ConnectKit',
    component: <ConnectKit trackingPackageName={trackingPackages[0].packageName} />,
  },
  {
    name: 'RainbowKit',
    component: <RainbowKit trackingPackageName={trackingPackages[0].packageName} />,
  },
];

export function StartedWrapper() {
  return (
    <div className="mt-6">
      {/* <Tabs items={trackingPackages.map((p) => p.name)}>
        {trackingPackages.map((p) => (
          <Tabs.Tab key={p.name}>
            ...
          </Tabs.Tab>
        ))}
      </Tabs> */}

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
