import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/unit/setup.ts',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    maxForks: 4,
    execArgv: process.version < 'v22.12.0' ? ['--experimental-require-module'] : [],
    coverage: {
      provider: 'v8',
      include: [
        'src/components/**',
        'src/features/**',
        'src/context/**',
        'src/services/**',
        'src/utils/**',
        'src/types/**',
        'src/App.tsx',
      ],
      reporter: ['text', 'text-summary', 'html'],
      reportsDirectory: 'tests/unit/coverage',
    },
  },
});