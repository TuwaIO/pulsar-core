import { OrbitAdapter } from '@tuwaio/orbit-core';
import { describe, expect, it } from 'vitest';

import {
  MAX_TRANSACTION_DESCRIPTION_LENGTH,
  MAX_TRANSACTION_PAYLOAD_BYTES,
  MAX_TRANSACTION_TITLE_LENGTH,
  PulsarTransactionValidationError,
  validateInitialTransactionParams,
} from './transactionValidation';

const validParams = {
  adapter: OrbitAdapter.EVM,
  desiredChainID: 1,
  type: 'SWAP',
} as const;

describe('transactionValidation', () => {
  it('rejects titles longer than the allowed limit', () => {
    expect(() =>
      validateInitialTransactionParams({
        ...validParams,
        title: 'a'.repeat(MAX_TRANSACTION_TITLE_LENGTH + 1),
      }),
    ).toThrow(PulsarTransactionValidationError);
  });

  it('rejects descriptions longer than the allowed limit', () => {
    expect(() =>
      validateInitialTransactionParams({
        ...validParams,
        description: 'a'.repeat(MAX_TRANSACTION_DESCRIPTION_LENGTH + 1),
      }),
    ).toThrow(PulsarTransactionValidationError);
  });

  it('validates each tuple item', () => {
    expect(() =>
      validateInitialTransactionParams({
        ...validParams,
        title: ['Pending', 'Success', 'a'.repeat(MAX_TRANSACTION_TITLE_LENGTH + 1), 'Replaced'],
      }),
    ).toThrow(PulsarTransactionValidationError);
  });

  it('rejects executable-like title and description strings', () => {
    expect(() =>
      validateInitialTransactionParams({
        ...validParams,
        title: 'eval(alert)',
      }),
    ).toThrow(PulsarTransactionValidationError);

    expect(() =>
      validateInitialTransactionParams({
        ...validParams,
        description: 'javascript:alert(1)',
      }),
    ).toThrow(PulsarTransactionValidationError);
  });

  it('rejects executable-like payload values', () => {
    expect(() =>
      validateInitialTransactionParams({
        ...validParams,
        payload: {
          callback: 'setTimeout("alert(1)")',
        },
      }),
    ).toThrow(PulsarTransactionValidationError);
  });

  it('rejects payloads larger than 10KB when serialized', () => {
    expect(() =>
      validateInitialTransactionParams({
        ...validParams,
        payload: {
          value: 'a'.repeat(MAX_TRANSACTION_PAYLOAD_BYTES),
        },
      }),
    ).toThrow(PulsarTransactionValidationError);
  });
});
