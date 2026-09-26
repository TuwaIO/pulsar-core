'use client';

import { StyledLink } from '@tuwaio/docs-ui';

import { CombineSteps } from '@/components/started-steps/solana/CombineSteps';
import { TxBlockStep, TxBlockStepCodeGenerateParams } from '@/components/started-steps/solana/TxBlockStep';

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
          The <b>Pulsar</b> Solana adapter reads the wallet connection saved by Satellite Connect and signs with any
          Wallet Standard wallet. This guide uses <StyledLink href={link}>{title}</StyledLink> (built on Satellite
          Connect) to connect the wallet; set it up first. The code below expects your RPC URLs by cluster to be
          exported as `solanaRPCUrls` from `@/configs/appConfig`.
        </p>
        <CombineSteps />
      </div>
      <TxBlockStep importLine={importLine} buttonLine={buttonLine} />
    </div>
  );
}
