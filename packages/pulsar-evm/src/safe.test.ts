/**
 * @file The `@tuwaio/pulsar-evm/safe` entry must not load wagmi or `@tuwaio/orbit-evm`, so apps built on viem alone can
 * use the Safe tracker.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

const srcDir = dirname(fileURLToPath(import.meta.url));

/** The package imports of a source file and of every relative module it imports, recursively. */
function packageImports(file: string, seen = new Set<string>()): Set<string> {
  const packages = new Set<string>();
  if (seen.has(file)) return packages;
  seen.add(file);
  const source = readFileSync(file, 'utf8');
  for (const [, specifier] of source.matchAll(/from\s+'([^']+)'/g)) {
    if (specifier.startsWith('.')) {
      for (const nested of packageImports(resolve(dirname(file), `${specifier}.ts`), seen)) packages.add(nested);
    } else {
      packages.add(specifier);
    }
  }
  return packages;
}

describe('@tuwaio/pulsar-evm/safe', () => {
  test('loads neither wagmi nor @tuwaio/orbit-evm', () => {
    const packages = packageImports(resolve(srcDir, 'safe.ts'));

    expect(packages.size).toBeGreaterThan(0);
    expect([...packages].filter((name) => name.startsWith('@wagmi/') || name === '@tuwaio/orbit-evm')).toEqual([]);
  });

  test('exports the Safe tracker', async () => {
    const safe = await import('./safe');

    expect(Object.keys(safe)).toEqual(
      expect.arrayContaining(['createSafeFetcher', 'safeFetcher', 'safeTrackerForStore', 'SafeTransactionServiceUrls']),
    );
  });
});
