'use client';

import { StartedBlockWrapper } from '@/components/started-blocks/solana/StartedBlockWrapper';

export function NovaConnect() {
  return (
    <StartedBlockWrapper
      link="https://satellite.docs.tuwa.io/"
      title="Nova Connect"
      importLine="import { ConnectButton } from '@tuwaio/nova-connect/components';"
      buttonLine="<ConnectButton />"
    />
  );
}
