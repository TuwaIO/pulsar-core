import { PackageInstallationTabs } from '@/components/PackageInstallationTabs';
import { ABIStep } from '@/components/started-steps/ABIStep';
import { ActionStep } from '@/components/started-steps/ActionStep';
import { OnSucceedCallbacksStep } from '@/components/started-steps/OnSucceedCallbacksStep';
import { TxTrackingStoreStep } from '@/components/started-steps/TxTrackingStoreStep';

export function CombineSteps() {
  return (
    <>
      <p className="my-2 text-[var(--tuwa-text-secondary)]">
        First, install the necessary <b>Pulsar</b> packages for transaction tracking and state management.
      </p>
      <PackageInstallationTabs />
      <ABIStep />
      <ActionStep />
      <OnSucceedCallbacksStep />
      <TxTrackingStoreStep />
    </>
  );
}
