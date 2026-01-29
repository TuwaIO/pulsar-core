import { PackageInstallationTabs } from '@tuwaio/docs-ui';
import { useTheme } from 'next-themes';

import { ActionStep } from '@/components/started-steps/solana/ActionStep';
import { IDLStep } from '@/components/started-steps/solana/IDLStep';
import { TxTrackingStoreStep } from '@/components/started-steps/solana/TxTrackingStoreStep';

export function CombineSteps() {
  const { resolvedTheme } = useTheme();
  return (
    <>
      <p className="my-2 text-[var(--tuwa-text-secondary)]">
        First, install the necessary <b>Pulsar</b> packages for transaction tracking and state management.
      </p>
      <PackageInstallationTabs
        packagesList="@tuwaio/pulsar-solana @tuwaio/pulsar-core gill @tuwaio/orbit-core @tuwaio/orbit-solana zustand immer dayjs @wallet-standard/app @wallet-standard/ui-registry"
        resolvedTheme={resolvedTheme ?? 'light'}
      />
      <IDLStep />
      <ActionStep />
      <TxTrackingStoreStep />
    </>
  );
}
