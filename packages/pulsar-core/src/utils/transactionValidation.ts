import { InitialTransactionParams, Transaction } from '../types';

/** Maximum allowed length for each transaction title string. */
export const MAX_TRANSACTION_TITLE_LENGTH = 100;

/** Maximum allowed length for each transaction description string. */
export const MAX_TRANSACTION_DESCRIPTION_LENGTH = 300;

/** Maximum allowed serialized UTF-8 payload size in bytes. */
export const MAX_TRANSACTION_PAYLOAD_BYTES = 10 * 1024;

const EXECUTABLE_STRING_PATTERNS = [
  /\beval\s*\(/i,
  /\bFunction\s*\(/,
  /\bset(?:Timeout|Interval)\s*\(\s*['"`]/i,
  /javascript\s*:/i,
];

/**
 * Error thrown when transaction metadata fails Pulsar's safety limits.
 */
export class PulsarTransactionValidationError extends Error {
  /** The transaction field that failed validation. */
  public readonly field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = 'PulsarTransactionValidationError';
    this.field = field;
  }
}

/**
 * Validates metadata used before a transaction action is executed.
 * Throws when title, description, or payload violates Pulsar safety limits.
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
 * Validates a complete transaction before it is persisted or synchronized.
 * Throws when title, description, or payload violates Pulsar safety limits.
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
