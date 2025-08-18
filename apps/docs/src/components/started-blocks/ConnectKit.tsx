'use client';

import { PackageInstallationTabsProps } from '@/components/PackageInstallationTabs';
import { StartedBlockWrapper } from '@/components/started-blocks/StartedBlockWrapper';

export function ConnectKit({ trackingPackageName }: PackageInstallationTabsProps) {
  return (
    <StartedBlockWrapper
      link="https://family.co/docs/connectkit"
      title="ConnectKit"
      importLine="import { ConnectKitButton } from 'connectkit';"
      buttonLine="<ConnectKitButton />"
      trackingPackageName={trackingPackageName}
    />
  );
}
