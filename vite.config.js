import { defineConfig } from 'vite';
import { resolve } from 'path';

/** Substrings of stderr lines we intentionally trigger in tests (data errors, jsdom limits). */
const SUPPRESSED_TEST_STDERR = [
  'Not implemented: navigation',
  'Error loading links:',
  'Error loading events:',
  'Error loading updates:',
  'Invalid category structure skipped',
  'Invalid event skipped',
  'Invalid update record structure',
  'Invalid date in event:',
  'End date before start date in event:',
  'Failed to load icon for',
  'Invalid date value in timestamp:',
  'Invalid timestamp provided to formatUpdateDate:',
  'Incomplete changelog entry skipped',
  'Changelog container not found',
  'Invalid changelog entry type skipped',
  'Update section container not found',
  'Update record is missing',
  'Invalid link skipped:',
];

export default defineConfig({
  root: 'src',
  base: '/',
  publicDir: '../public',
  // Explicitly define env prefix to ensure VITE_ variables are loaded
  envPrefix: 'VITE_',
  // Vite automatically loads .env files from project root even when root is 'src'
  // But we can explicitly set envDir to ensure it looks in the right place
  envDir: resolve(__dirname),
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
      output: {
        manualChunks: undefined,
      },
    },
    emptyOutDir: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['../tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    onConsoleLog(log, type) {
      if (type === 'stderr' && SUPPRESSED_TEST_STDERR.some((s) => log.includes(s))) {
        return false;
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '*.config.js',
      ],
    },
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      strict: false,
    },
  },
});
