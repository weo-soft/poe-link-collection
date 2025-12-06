import { defineConfig } from 'vite';
import { resolve } from 'path';

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
