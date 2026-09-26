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
        Install the <b>Pulsar</b> packages and their peer dependencies, plus `@solana/react` for the transaction signer
        used in Step 6.
      </p>
      <PackageInstallationTabs
        packagesList="@tuwaio/pulsar-core @tuwaio/pulsar-solana @tuwaio/pulsar-react @tuwaio/orbit-core @tuwaio/orbit-solana @solana/kit @solana/react @wallet-standard/app @wallet-standard/ui-core @wallet-standard/ui-registry zustand immer dayjs"
        resolvedTheme={resolvedTheme ?? 'light'}
      />
      <IDLStep />
      <ActionStep />
      <TxTrackingStoreStep />
    </>
  );
}
