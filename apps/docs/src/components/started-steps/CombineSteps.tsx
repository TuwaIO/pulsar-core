import { PackageInstallationTabs, PackageInstallationTabsProps } from '@/components/PackageInstallationTabs';
import { ABIStep } from '@/components/started-steps/ABIStep';
import { ActionStep } from '@/components/started-steps/ActionStep';
import { OnSucceedCallbacksStep } from '@/components/started-steps/OnSucceedCallbacksStep';
import { TxTrackingStoreStep } from '@/components/started-steps/TxTrackingStoreStep';

export function CombineSteps({ trackingPackageName }: PackageInstallationTabsProps) {
  return (
    <>
      <p className="my-2 text-[var(--tuwa-text-secondary)]">
        First, install the necessary TUWA packages for transaction tracking and state management.
      </p>
      <PackageInstallationTabs trackingPackageName={trackingPackageName} />
      <ABIStep />
      <ActionStep />
      <OnSucceedCallbacksStep />
      <TxTrackingStoreStep />
    </>
  );
}
