'use client';

import { StartedBlockWrapper } from '@/components/started-blocks/StartedBlockWrapper';

export function Dynamic() {
  return (
    <StartedBlockWrapper
      link="https://www.dynamic.xyz/docs/introduction/welcome"
      title="Dynamic.xyz"
      importLine="import { DynamicWidget } from '@dynamic-labs/sdk-react-core';"
      buttonLine="<DynamicWidget />"
    />
  );
}
