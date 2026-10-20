import { defineConfig } from 'tsup';

import pkg from './package.json';

export default defineConfig([
  {
    format: ['cjs', 'esm'],
    // `safe` is the entry without wagmi and `@tuwaio/orbit-evm`, for apps built on viem alone
    entry: { index: './src/index.ts', safe: './src/safe.ts' },
    sourcemap: false,
    splitting: true,
    treeshake: true,
    minify: true,
    clean: true,
    dts: true,
    external: [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.devDependencies || {})],
  },
]);
