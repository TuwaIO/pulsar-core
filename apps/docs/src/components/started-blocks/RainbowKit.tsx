'use client';

import { PackageInstallationTabsProps } from '@/components/PackageInstallationTabs';
import { StartedBlockWrapper } from '@/components/started-blocks/StartedBlockWrapper';

export function RainbowKit({ trackingPackageName }: PackageInstallationTabsProps) {
  return (
    <StartedBlockWrapper
      link="https://rainbowkit.com/docs/installation"
      title="RainbowKit"
      importLine="import { ConnectButton } from '@rainbow-me/rainbowkit';"
      buttonLine="<ConnectButton />"
      trackingPackageName={trackingPackageName}
    />
  );
}
