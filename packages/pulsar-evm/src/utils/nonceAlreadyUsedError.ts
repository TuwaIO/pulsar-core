/**
 * @file The error of a speed-up or cancel that has nothing to replace any more.
 */

import { Hex } from 'viem';

/**
 * The error of `speedUpTxAction` and `cancelTxAction`, as the `cause` of what they throw, when the nonce of the transaction is already
 * used: the transaction was mined or replaced meanwhile, and no wallet prompt was opened. An app tells it by its `name`,
 * `NonceAlreadyUsedError`, and says so in its own words.
 */
export class NonceAlreadyUsedError extends Error {
  override name = 'NonceAlreadyUsedError';

  /**
   * @param hash - The hash of the transaction, or the key it is tracked under.
   */
  constructor(hash: Hex | string) {
    super(`The nonce of transaction ${hash} is already used: it was mined or replaced.`);
  }
}
