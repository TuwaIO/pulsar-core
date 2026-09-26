/**
 * @file Safety limits for the user-facing metadata of transactions (title, description, payload), checked before a
 * transaction is executed, stored, restored or synchronized.
 */

import { InitialTransactionParams, Transaction } from '../types';

/** Maximum length, in characters, of each `title` string. */
export const MAX_TRANSACTION_TITLE_LENGTH = 100;

/** Maximum length, in characters, of each `description` string. */
export const MAX_TRANSACTION_DESCRIPTION_LENGTH = 300;

/** Maximum size, in bytes, of the UTF-8 JSON of `payload`. */
export const MAX_TRANSACTION_PAYLOAD_BYTES = 10 * 1024;

const EXECUTABLE_STRING_PATTERNS = [
  /\beval\s*\(/i,
  /\bFunction\s*\(/,
  /\bset(?:Timeout|Interval)\s*\(\s*['"`]/i,
  /javascript\s*:/i,
];

/**
 * Thrown when the title, description or payload of a transaction breaks Pulsar's safety limits.
 */
export class PulsarTransactionValidationError extends Error {
  /** The field that failed, for example `title`, `description[1]` or `payload.amount`. */
  public readonly field: string;

  /**
   * @param field - The field that failed.
   * @param message - The error message.
   */
  constructor(field: string, message: string) {
    super(message);
    this.name = 'PulsarTransactionValidationError';
    this.field = field;
  }
}

/**
 * Validates the metadata passed to `executeTxAction` before anything else runs.
 *
 * Each `title` string must be at most {@link MAX_TRANSACTION_TITLE_LENGTH} characters and each `description` string at
 * most {@link MAX_TRANSACTION_DESCRIPTION_LENGTH}. `payload` must be JSON-serializable and at most
 * {@link MAX_TRANSACTION_PAYLOAD_BYTES} bytes as UTF-8 JSON. Strings (including payload keys) must not match
 * executable-like patterns: `eval(`, `Function(`, `setTimeout`/`setInterval` with a string argument, and `javascript:`.
 * This is a defensive gate, not a replacement for escaping output in the UI.
 *
 * @param params - The transaction metadata.
 * @throws {@link PulsarTransactionValidationError} for the first field that breaks a rule.
 */
export function validateInitialTransactionParams(params: Omit<InitialTransactionParams, 'actionFunction'>): void {
  validateTextField({
    field: 'title',
    value: params.title,
    maxLength: MAX_TRANSACTION_TITLE_LENGTH,
  });
  validateTextField({
    field: 'description',
    value: params.description,
    maxLength: MAX_TRANSACTION_DESCRIPTION_LENGTH,
  });
  validatePayload(params.payload);
}

/**
 * Validates the title, description and payload of a complete transaction with the rules of
 * {@link validateInitialTransactionParams}. Used by `addTxToPool`, `initializeTransactionsPool` and
 * `injectExternalPendingTxs`.
 *
 * @template T - The application transaction type.
 * @param tx - The transaction.
 * @throws {@link PulsarTransactionValidationError} for the first field that breaks a rule.
 */
export function validateTransaction<T extends Transaction>(tx: T): void {
  validateTextField({
    field: 'title',
    value: tx.title,
    maxLength: MAX_TRANSACTION_TITLE_LENGTH,
  });
  validateTextField({
    field: 'description',
    value: tx.description,
    maxLength: MAX_TRANSACTION_DESCRIPTION_LENGTH,
  });
  validatePayload(tx.payload);
}

function validateTextField({
  field,
  value,
  maxLength,
}: {
  field: string;
  value?: string | [string, string, string, string];
  maxLength: number;
}) {
  if (value === undefined) return;

  const values = Array.isArray(value) ? value : [value];

  values.forEach((item, index) => {
    const label = Array.isArray(value) ? `${field}[${index}]` : field;

    if (typeof item !== 'string') {
      throw new PulsarTransactionValidationError(label, `${label} must be a string.`);
    }

    if (item.length > maxLength) {
      throw new PulsarTransactionValidationError(label, `${label} must be ${maxLength} characters or less.`);
    }

    assertNoExecutableString(label, item);
  });
}

function validatePayload(payload: Record<string, string | number> | undefined): void {
  if (payload === undefined) return;

  let serializedPayload: string | undefined;

  try {
    serializedPayload = JSON.stringify(payload);
  } catch {
    throw new PulsarTransactionValidationError('payload', 'payload must be JSON-serializable.');
  }

  if (serializedPayload === undefined) {
    throw new PulsarTransactionValidationError('payload', 'payload must be JSON-serializable.');
  }

  const payloadSize = new TextEncoder().encode(serializedPayload).length;
  if (payloadSize > MAX_TRANSACTION_PAYLOAD_BYTES) {
    throw new PulsarTransactionValidationError(
      'payload',
      `payload must be ${MAX_TRANSACTION_PAYLOAD_BYTES} bytes or less when serialized.`,
    );
  }

  assertNoExecutablePayloadValue(payload);
}

function assertNoExecutablePayloadValue(value: unknown, path = 'payload'): void {
  if (typeof value === 'string') {
    assertNoExecutableString(path, value);
    return;
  }

  if (value === null || typeof value !== 'object') return;

  Object.entries(value as Record<string, unknown>).forEach(([key, nestedValue]) => {
    const nestedPath = `${path}.${key}`;
    assertNoExecutableString(nestedPath, key);
    assertNoExecutablePayloadValue(nestedValue, nestedPath);
  });
}

function assertNoExecutableString(field: string, value: string): void {
  if (EXECUTABLE_STRING_PATTERNS.some((pattern) => pattern.test(value))) {
    throw new PulsarTransactionValidationError(field, `${field} contains a blocked executable-like pattern.`);
  }
}
