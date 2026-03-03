import 'dotenv/config';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      GELATO_API_KEY: process.env.GELATO_API_KEY,
    },
  },
});
