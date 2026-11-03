import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import contactHandler from './api/contact.js';

/** This config build has no @types/node; these keep Node globals typed. */
declare const console: { error: (...data: unknown[]) => void };
declare const process: { env: Record<string, string | undefined>; cwd: () => string };

/**
 * Serves the shared serverless contact handler at /api/contact while developing
 * (and previewing) locally. In production Vercel runs `api/contact.js` directly.
 *
 * Vite only injects `VITE_`-prefixed variables into the client bundle and never
 * copies `.env` into `process.env`, so the handler would otherwise always see
 * `RESEND_API_KEY` as unset locally. The `config` hook below loads the plain
 * server-side variables into `process.env` once, at startup — they are never
 * exposed to the browser bundle.
 */
function contactApi(): Plugin {
  const mount = (server: { middlewares: { use: Function } }) => {
    server.middlewares.use('/api/contact', async (req: any, res: any) => {
      try {
        await contactHandler(req, res);
      } catch (error) {
        console.error('[contact] unhandled error:', error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        res.end(JSON.stringify({ ok: false, error: 'Something went wrong. Please try again.' }));
      }
    });
  };

  return {
    name: 'contact-api-dev',
    config(_config, { mode }) {
      const env = loadEnv(mode, process.cwd(), '');
      const keys = ['RESEND_API_KEY', 'CONTACT_FROM', 'CONTACT_TO'] as const;
      for (const key of keys) {
        const value = env[key];
        // Real environment variables (CI, host dashboard) always win over the file.
        if (value && !process.env[key]) process.env[key] = value;
      }
    },
    configureServer: mount,
    configurePreviewServer: mount,
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), contactApi()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
      },
    },
  },
});
