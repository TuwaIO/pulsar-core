'use client';

import { StyledLink } from '@tuwaio/docs-ui';

import { CombineSteps } from '@/components/started-steps/evm/CombineSteps';
import { TxBlockStep, TxBlockStepCodeGenerateParams } from '@/components/started-steps/evm/TxBlockStep';

export function StartedBlockWrapper({
  link,
  title,
  importLine,
  buttonLine,
}: TxBlockStepCodeGenerateParams & { link: string; title: string }) {
  return (
    <div className="flex flex-col">
      <div>
        <h3 className="mb-2 text-xl font-semibold text-[var(--tuwa-text-primary)]">Step 1: Wallet Connector Setup</h3>
        <p className="text-[var(--tuwa-text-secondary)]">
          The <b>Pulsar</b> EVM adapter works with any `@wagmi/core` setup. This guide uses{' '}
          <StyledLink href={link}>{title}</StyledLink> to connect the wallet; set it up first. The code below expects
          your wagmi config and viem chains to be exported as `wagmiConfig` and `appChains` from
          `@/configs/wagmiConfig`.
        </p>
        <CombineSteps />
      </div>
      <TxBlockStep importLine={importLine} buttonLine={buttonLine} />
    </div>
  );
}
