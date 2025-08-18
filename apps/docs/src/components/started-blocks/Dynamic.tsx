'use client';

import { PackageInstallationTabsProps } from '@/components/PackageInstallationTabs';
import { StartedBlockWrapper } from '@/components/started-blocks/StartedBlockWrapper';

export function Dynamic({ trackingPackageName }: PackageInstallationTabsProps) {
  return (
    <StartedBlockWrapper
      link="https://www.dynamic.xyz/docs/introduction/welcome"
      title="Dynamic.xyz"
      importLine="import { DynamicWidget } from '@dynamic-labs/sdk-react-core';"
      buttonLine="<DynamicWidget />"
      trackingPackageName={trackingPackageName}
    />
  );
}
