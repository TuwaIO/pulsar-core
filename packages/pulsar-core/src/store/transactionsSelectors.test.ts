import { OrbitAdapter } from '@tuwaio/orbit-core';
import { describe, expect, it } from 'vitest';

import { Transaction, TransactionPool } from '../types';
import { selectAllTransactionsByActiveWallet } from './transactionsSelectors';

const SOLANA_ADDRESS = '4aye4uNAafCDn4L7EBGXhwjDTxEHMMFYcGD169e4Udv8';
const EVM_ADDRESS = '0xAbCdEf0000000000000000000000000000000001';

const poolOf = (adapter: OrbitAdapter, from: string): TransactionPool<Transaction> => ({
  key: { txKey: 'key', adapter, from, localTimestamp: 1 } as Transaction,
});

describe('selectAllTransactionsByActiveWallet', () => {
  it('finds an EVM wallet with its address in any case', () => {
    const pool = poolOf(OrbitAdapter.EVM, EVM_ADDRESS);
    expect(selectAllTransactionsByActiveWallet(pool, EVM_ADDRESS.toLowerCase())).toHaveLength(1);
  });

  it('finds a Solana wallet by its exact address', () => {
    const pool = poolOf(OrbitAdapter.SOLANA, SOLANA_ADDRESS);
    expect(selectAllTransactionsByActiveWallet(pool, SOLANA_ADDRESS)).toHaveLength(1);
  });

  // A base58 address in another case is another account: its transactions are not this wallet's
  it('does not take a Solana address in another case for the same wallet', () => {
    const pool = poolOf(OrbitAdapter.SOLANA, SOLANA_ADDRESS);
    expect(selectAllTransactionsByActiveWallet(pool, SOLANA_ADDRESS.toLowerCase())).toHaveLength(0);
  });
});
