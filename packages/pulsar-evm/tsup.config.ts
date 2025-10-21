import { defineConfig } from 'tsup';

export default defineConfig([
  {
    format: ['cjs', 'esm'],
    entry: ['./src/index.ts'],
    treeshake: true,
    sourcemap: true,
    minify: true,
    clean: true,
    dts: true,
    external: [
      '@tuwaio/orbit-core',
      '@tuwaio/pulsar-core',
      '@tuwaio/orbit-evm',
      '@wagmi/core',
      'viem',
      'dayjs',
      'immer',
      'zustand',
    ],
  },
]);
