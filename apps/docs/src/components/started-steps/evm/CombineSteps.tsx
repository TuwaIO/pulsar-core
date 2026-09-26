import { PackageInstallationTabs } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

import { ABIStep } from '@/components/started-steps/evm/ABIStep';
import { ActionStep } from '@/components/started-steps/evm/ActionStep';
import { TxTrackingStoreStep } from '@/components/started-steps/evm/TxTrackingStoreStep';

export function CombineSteps() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <p className="my-2 text-[var(--tuwa-text-secondary)]">
        Install the <b>Pulsar</b> packages and their peer dependencies.
      </p>
      <PackageInstallationTabs
        packagesList="@tuwaio/pulsar-core @tuwaio/pulsar-evm @tuwaio/pulsar-react @tuwaio/orbit-core @tuwaio/orbit-evm @wagmi/core viem zustand immer dayjs"
        resolvedTheme={resolvedTheme ?? 'light'}
      />
      <ABIStep />
      <ActionStep />
      <TxTrackingStoreStep />
    </>
  );
}
