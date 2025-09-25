import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Tabs } from 'nextra/components';

import { StartedWrapperEvm } from '@/components/started-blocks/evm/StartedWrapper';
import { StartedWrapperSolana } from '@/components/started-blocks/solana/StartedWrapper';

const adapterTypes = [
  {
    name: OrbitAdapter.EVM,
    component: <StartedWrapperEvm />,
  },
  {
    name: OrbitAdapter.SOLANA,
    component: <StartedWrapperSolana />,
  },
];

export function StartedBlocks() {
  return (
    <div className="mt-6">
      <div>
        <h3 className="mb-4 text-[28px] font-semibold text-[var(--tuwa-text-primary)]">
          Choose your preferred adapter type:
        </h3>
        <Tabs items={adapterTypes.map((c) => c.name)}>
          {adapterTypes.map((connector) => (
            <Tabs.Tab key={connector.name}>{connector.component}</Tabs.Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
