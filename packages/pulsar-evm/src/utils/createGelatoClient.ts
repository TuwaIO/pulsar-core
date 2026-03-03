/**
 * @file This file contains a utility function for creating a cached viem HTTP transport
 * client configured for the Gelato Relay API.
 */

import { http, HttpTransportConfig, Transport } from 'viem';

/**
 * Configuration options for creating a Gelato API client.
 *
 * @property {string} apiKey - The Gelato API key used for authentication.
 * @property {number} [timeout] - Optional custom HTTP timeout in milliseconds. Defaults to 15000ms.
 * @property {string} [baseUrl] - Optional custom base URL for the Gelato API. Defaults to `https://api.gelato.cloud/rpc`.
 * @property {HttpTransportConfig} [httpTransportConfig] - Optional additional viem HTTP transport configuration overrides.
 */
export type GelatoClientConfig = {
  apiKey: string;
  timeout?: number;
  baseUrl?: string;
  httpTransportConfig?: HttpTransportConfig;
};

/**
 * In-memory cache for Gelato transport instances, keyed by `apiKey:baseUrl`.
 * Prevents creating duplicate transport instances for the same API key and endpoint.
 */
const gelatoClientCache = new Map<string, ReturnType<Transport>>();

/**
 * Creates or retrieves a cached viem HTTP transport client configured for the Gelato Relay API.
 *
 * The client is cached by a composite key of `apiKey` and `baseUrl` to avoid
 * creating redundant transport instances for identical configurations.
 *
 * The default HTTP timeout is set to 15 seconds (instead of viem's default) because
 * Gelato's synchronous relay methods may take up to 10 seconds on the server side,
 * and the client should not time out before the server does.
 *
 * @param {GelatoClientConfig} parameters - The configuration for the Gelato client.
 * @returns {ReturnType<Transport>} A viem transport instance configured for the Gelato API.
 */
export const createGelatoClient = (parameters: GelatoClientConfig): ReturnType<Transport> => {
  const { apiKey, baseUrl, timeout } = parameters;

  const base = baseUrl || 'https://api.gelato.cloud';
  const cacheKey = `${apiKey}:${base}`;

  // Return the cached client if one already exists for this configuration.
  const cachedClient = gelatoClientCache.get(cacheKey);
  if (cachedClient) {
    return cachedClient;
  }

  const config: HttpTransportConfig = {
    // Unless overridden, increase http timeout to 15s due to sync methods.
    // We want the sync methods to timeout on the server, not on the client.
    // Default for sync methods is 10s.
    timeout: timeout ?? 15_000,
    ...parameters.httpTransportConfig,
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...parameters.httpTransportConfig?.fetchOptions?.headers,
      },
      ...parameters.httpTransportConfig?.fetchOptions,
    },
  };

  const client = http(`${base}/rpc`, config)({});
  gelatoClientCache.set(cacheKey, client);

  return client;
};
