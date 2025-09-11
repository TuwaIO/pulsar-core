/**
 * @file This file contains utility functions for interacting with the Solana Name Service (SNS) provided by Bonfida.
 */

import { getDomainKeysWithReverses, getRecord, performReverseLookup, Record } from '@bonfida/spl-name-service';
import { getBase58Decoder, getBase58Encoder } from '@solana/kit';
import { ConnectionContextState } from '@solana/wallet-adapter-react';

// A minimal PublicKey class to satisfy the @bonfida/spl-name-service dependency
// without importing the entire @solana/web3.js package. This is a form of duck typing.
class PublicKey {
  private readonly _bn: Uint8Array;

  constructor(value: string) {
    // The return type of `encode` is `ReadonlyUint8Array`, which we cast to `Uint8Array`.
    this._bn = getBase58Encoder().encode(value) as Uint8Array;
  }

  toBuffer(): Buffer {
    return Buffer.from(this._bn);
  }

  toString(): string {
    // The decoder returns a tuple [decodedString, bytesRead], we need the first element.
    const [decodedString] = getBase58Decoder().decode(this._bn);
    return decodedString;
  }
}

/**
 * Performs a reverse lookup to find the .sol domain name for a given wallet address.
 * @param {ConnectionContextState} connection - The connection state object from the `useConnection` hook.
 * @param {string} address - The public key of the wallet as a string.
 * @returns {Promise<string | null>} The .sol domain name (e.g., "bonfida.sol") or null if not found.
 */
export const getSolanaName = async (connection: ConnectionContextState, address: string): Promise<string | null> => {
  try {
    const pubKey = new PublicKey(address);

    // @ts-expect-error We are duck-typing the PublicKey to avoid a full dependency.
    const domainKeys = await getDomainKeysWithReverses(connection.connection, pubKey);

    if (domainKeys.length === 0) {
      return null;
    }

    // @ts-expect-error Duck-typing continued for the result.
    const domainName = await performReverseLookup(connection.connection, domainKeys[0]);
    return `${domainName}.sol`;
  } catch {
    // Fails silently if no domain is found.
    return null;
  }
};

/**
 * Retrieves the avatar URL from the 'pic' record of a .sol domain name.
 * @param {ConnectionContextState} connection - The connection state object from the `useConnection` hook.
 * @param {string} name - The .sol domain name (e.g., "bonfida.sol").
 * @returns {Promise<string | null>} The URL of the avatar or null if not found or set.
 */
export const getSolanaAvatar = async (connection: ConnectionContextState, name: string): Promise<string | null> => {
  try {
    const record = await getRecord(connection.connection, name, Record.Pic);

    if (!record || !record.data) {
      return null;
    }

    return record.data.toString('utf-8');
  } catch {
    // Fails silently if the record doesn't exist.
    return null;
  }
};
