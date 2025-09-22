'use client';

import { StartedBlockWrapper } from '@/components/started-blocks/evm/StartedBlockWrapper';

export function RainbowKit() {
  return (
    <StartedBlockWrapper
      link="https://rainbowkit.com/docs/installation"
      title="RainbowKit"
      importLine="import { ConnectButton } from '@rainbow-me/rainbowkit';"
      buttonLine="<ConnectButton />"
    />
  );
}
