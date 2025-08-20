'use client';

import { StartedBlockWrapper } from '@/components/started-blocks/StartedBlockWrapper';

export function ConnectKit() {
  return (
    <StartedBlockWrapper
      link="https://family.co/docs/connectkit"
      title="ConnectKit"
      importLine="import { ConnectKitButton } from 'connectkit';"
      buttonLine="<ConnectKitButton />"
    />
  );
}
