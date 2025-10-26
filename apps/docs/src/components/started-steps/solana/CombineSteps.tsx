import { PackageInstallationTabs } from '@/components/PackageInstallationTabs';
import { ActionStep } from '@/components/started-steps/solana/ActionStep';
import { IDLStep } from '@/components/started-steps/solana/IDLStep';
import { TxTrackingStoreStep } from '@/components/started-steps/solana/TxTrackingStoreStep';

export function CombineSteps() {
  return (
    <>
      <p className="my-2 text-[var(--tuwa-text-secondary)]">
        First, install the necessary <b>Pulsar</b> packages for transaction tracking and state management.
      </p>
      <PackageInstallationTabs packagesList="@tuwaio/pulsar-solana @tuwaio/pulsar-core gill @tuwaio/orbit-core @tuwaio/orbit-solana zustand immer dayjs @wallet-standard/app @wallet-standard/ui-registry" />
      <IDLStep />
      <ActionStep />
      <TxTrackingStoreStep />
    </>
  );
}
