import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// In production /api/jack is a Vercel function; in local dev Vite serves the same handler
// so the Jack chat works on localhost too.
const jackDevApi = (): Plugin => ({
  name: 'jack-dev-api',
  configureServer(server) {
    server.middlewares.use('/api/jack', async (req, res) => {
      const { default: handler } = await server.ssrLoadModule('/api/jack.ts');
      await handler(req, res);
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Expose .env (including server-only keys like GROQ_API_KEY) to the dev API handler
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react(), jackDevApi()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: '/', // Ensure base path is correct for Vercel deployment
  };
});
