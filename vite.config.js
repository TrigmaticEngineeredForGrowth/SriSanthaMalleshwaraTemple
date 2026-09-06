import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { extname, join } from 'path';

const serveJsxAsText = () => ({
  name: 'serve-jsx-as-text',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || '';
      if (url.endsWith('.jsx') || url.endsWith('.css')) {
        const filePath = join(process.cwd(), url.split('?')[0]);
        try {
          const content = readFileSync(filePath, 'utf-8');
          res.setHeader('Content-Type', url.endsWith('.jsx') ? 'text/babel' : 'text/css');
          res.setHeader('Cache-Control', 'no-store');
          res.end(content);
          return;
        } catch {
          // fall through to next handler
        }
      }
      next();
    });
  },
});

export default defineConfig({
  plugins: [serveJsxAsText()],
  server: {
    port: 5173,
    host: true,
    open: false,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  appType: 'mpa',
  build: {
    outDir: 'dist',
  },
});
