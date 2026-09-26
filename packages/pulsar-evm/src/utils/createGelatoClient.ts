/**
 * @file Creates a cached viem HTTP transport for the Gelato Relay RPC API.
 */

import { http, HttpTransportConfig, Transport } from 'viem';

/**
 * The configuration of {@link createGelatoClient}.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` instead.
 */
export type GelatoClientConfig = {
  /** The Gelato API key, sent as a `Bearer` token. */
  apiKey: string;
  /** HTTP timeout in milliseconds. Defaults to 15000. */
  timeout?: number;
  /** The base URL of the Gelato API; `/rpc` is appended. Defaults to `https://api.gelato.cloud`. */
  baseUrl?: string;
  /** Additional options for viem's `http` transport. Its `timeout` overrides `timeout`. */
  httpTransportConfig?: HttpTransportConfig;
};

/** In-memory cache of Gelato transports, keyed by `apiKey:baseUrl`. */
const gelatoClientCache = new Map<string, ReturnType<Transport>>();

/**
 * Creates a viem HTTP transport for `<baseUrl>/rpc` of the Gelato Relay API, authenticated with `apiKey`. The default
 * timeout is 15 s because Gelato's synchronous relay methods can take up to 10 s.
 *
 * Side effects: the transport is cached in memory by `apiKey` and `baseUrl` until the page is reloaded; later calls
 * with the same pair return the cached transport and ignore the other options. Creating it sends no request.
 *
 * @deprecated Gelato relay is deprecated. Use `TransactionTracker.ERC4337` and `createBundlerRpcClient` from
 * `@tuwaio/orbit-evm` instead.
 * @param parameters - The API key and transport options.
 * @returns The transport; use its `request` method to call the Gelato RPC API.
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
