import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

/**
 * Serves static sub-directory index.html pages inside public/ (dev) and dist/ (preview),
 * such as /papers/ and /papers/paired-evaluation/, before Vite's SPA fallback catches them.
 */
function staticSubdirIndexPlugin(): Plugin {
  const attachMiddleware = (
    middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void },
    rootDir: string
  ) => {
    middlewares.use((req, res, next) => {
      const rawUrl: string = req.url || '/';
      const cleanPath = rawUrl.split('?')[0].split('#')[0];
      if (!cleanPath.startsWith('/papers')) {
        return next();
      }
      // Let direct file requests (.pdf, .css, .html, etc.) pass through normally
      if (/\.[a-z0-9]+$/i.test(cleanPath)) {
        return next();
      }
      const normalized = cleanPath.replace(/\/+$/, '');
      const candidate = path.join(rootDir, normalized, 'index.html');
      if (fs.existsSync(candidate)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        fs.createReadStream(candidate).pipe(res);
        return;
      }
      return next();
    });
  };

  return {
    name: 'static-subdir-index',
    configureServer(server) {
      attachMiddleware(server.middlewares, path.resolve(__dirname, 'public'));
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares, path.resolve(__dirname, 'dist'));
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      staticSubdirIndexPlugin(),
      react(),
      tailwindcss(),
      cssInjectedByJsPlugin(), // necesario para que Tailwind v4 + Vite funcione en producción
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('react-github-calendar') ||
                id.includes('react-activity-calendar') ||
                id.includes('date-fns')
              ) {
                return 'vendor-github';
              }
              return 'vendor';
            }
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
