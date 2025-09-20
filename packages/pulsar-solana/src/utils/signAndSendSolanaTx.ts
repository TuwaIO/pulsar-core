/**
 * @file This file contains a utility function for signing and sending Solana transactions.
 * It simplifies the process of creating, signing, and broadcasting a transaction to the network.
 */

import { Instruction, signTransactionMessageWithSigners, SolanaClient, TransactionSendingSigner } from 'gill';
import { createTransaction } from 'gill';

/**
 * Creates, signs, and sends a Solana transaction with one or more instructions.
 *
 * This async function orchestrates the common flow for broadcasting a transaction:
 * 1. Fetches the latest blockhash from the RPC.
 * 2. Creates a versioned transaction (`v0`).
 * 3. Signs the transaction with the provided signer.
 * 4. Sends the transaction to the network.
 * 5. Decodes and returns the resulting transaction signature.
 *
 * @param {object} params - The parameters for signing and sending the transaction.
 * @param {SolanaClient} params.client - The Solana client instance for RPC communication.
 * @param {TransactionSendingSigner} params.signer - The signer (e.g., a wallet) responsible for signing the transaction.
 * @param {Instruction | Instruction[]} params.instruction - A single instruction or an array of instructions to include in the transaction.
 * @returns A promise that resolves to the transaction signature.
 * @throws Will throw an error if any of the async operations (fetching blockhash, signing, sending) fail.
 *
 * @example
 * const signature = await signAndSendSolanaTx({
 * client: mySolanaClient,
 * signer: wallet,
 * instruction: myTransferInstruction,
 * });
 * console.log('Transaction sent with signature:', signature);
 */
export async function signAndSendSolanaTx({
  client,
  signer,
  instruction,
}: {
  client: SolanaClient;
  signer: TransactionSendingSigner;
  instruction: Instruction | Instruction[];
}) {
  // 1. Fetch the latest blockhash to ensure transaction validity.
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send();

  // 2. Create a version 0 transaction, which is the current standard.
  const transaction = createTransaction({
    feePayer: signer,
    version: 0,
    latestBlockhash,
    instructions: Array.isArray(instruction) ? instruction : [instruction],
  });
  // 3. Sign the transaction message.
  const signedTransaction = await signTransactionMessageWithSigners(transaction);
  // 4. Send it to the network.
  return await client.sendAndConfirmTransaction(signedTransaction);
}
