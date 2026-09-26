/**
 * @file Builds, signs and sends a Solana transaction with `@solana/kit`.
 */

import type { Instruction, TransactionSendingSigner } from '@solana/kit';
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase58Decoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
} from '@solana/kit';
import type { SolanaClient } from '@tuwaio/orbit-solana';

/**
 * Builds a version 0 transaction with the given instructions, the signer as fee payer and the latest blockhash, then
 * has the signer sign and send it. Use it inside an `actionFunction`: the returned signature is the `txKey` the Solana
 * tracker follows.
 *
 * Side effects: calls `getLatestBlockhash` through `client.rpc` and asks the wallet behind `signer` to sign and send
 * the transaction.
 *
 * @param params - The client, the signer and the instructions.
 * @param params.client - A Solana client, for example from `createSolanaClientWithCache` of `@tuwaio/orbit-solana`.
 * @param params.signer - A `TransactionSendingSigner`, such as the one from `useWalletAccountTransactionSendingSigner`
 * of `@solana/react`; it pays the fee.
 * @param params.instruction - One instruction or an array of instructions.
 * @returns The transaction signature, base58-encoded.
 * @throws The error of the RPC call or of the signer (for example when the user rejects the transaction).
 *
 * @example
 * ```ts
 * const signature = await signAndSendSolanaTx({ client, signer, instruction: transferInstruction });
 * ```
 */
export async function signAndSendSolanaTx({
  client,
  signer,
  instruction,
}: {
  client: SolanaClient;
  signer: TransactionSendingSigner;
  instruction: Instruction | Instruction[];
}): Promise<string> {
  // 1. Fetch the latest blockhash to ensure transaction validity.
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send();

  // 2. Create a version 0 transaction message using @solana/kit pipeline.
  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(signer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions(Array.isArray(instruction) ? instruction : [instruction], m),
  );

  // 3. Sign the transaction message and send it to the network.
  const signature = await signAndSendTransactionMessageWithSigners(transactionMessage);

  // 4. Decode the resulting signature into the final base58 format.
  return getBase58Decoder().decode(signature);
}
