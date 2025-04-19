import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5000,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        // Add Node.js polyfills
        'process': 'process/browser',
        'stream': 'stream-browserify',
        'util': 'util',
      },
    },
    define: {
      // Define global process variables - this makes env variables available to client code
      'process.env': {
        ...env,
        // Always include these environment variables
        NODE_ENV: mode,
        // Include secure variables, but don't expose sensitive ones in production
        JWT_SECRET: mode === 'production' ? undefined : env.JWT_SECRET,
        PREVIOUS_JWT_SECRET: mode === 'production' ? undefined : env.PREVIOUS_JWT_SECRET,
      },
      'global': {},
    },
  };
});