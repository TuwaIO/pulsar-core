'use client';

import { CombineSteps } from '@/components/started-steps/evm/CombineSteps';
import { TxBlockStep, TxBlockStepCodeGenerateParams } from '@/components/started-steps/evm/TxBlockStep';
import { StyledLink } from '@/components/StyledLink';

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
          The <b>Pulsar</b> engine works with any wagmi-based setup. This guide uses{' '}
          <StyledLink href={link}>{title}</StyledLink> as an example.
        </p>
        <CombineSteps />
      </div>
      <TxBlockStep importLine={importLine} buttonLine={buttonLine} />
    </div>
  );
}
