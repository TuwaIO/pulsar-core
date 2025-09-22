'use client';

import { StartedBlockWrapper } from '@/components/started-blocks/solana/StartedBlockWrapper';

export function WalletUi() {
  return (
    <StartedBlockWrapper
      link="https://wallet-ui.dev/"
      title="Wallet UI"
      importLine="import { WalletUiDropdown } from '@wallet-ui/react';"
      buttonLine="<WalletUiDropdown />"
    />
  );
}
