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

/**
 * Generates dist/404.html after build by reusing the exact compiled Vite bundle tags
 * from dist/index.html, guaranteeing 100% shared CSS, fonts, React, GSAP, Lenis,
 * LanguageContext, TearLink, CookieBanner, and Vercel Analytics/SpeedInsights.
 */
function generate404HtmlPlugin(): Plugin {
  return {
    name: 'generate-404-html',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) return;

      const builtIndex = fs.readFileSync(indexHtmlPath, 'utf-8');
      const assetTags = [
        ...(builtIndex.match(/<script\s+type="module"[^>]*><\/script>/g) || []),
        ...(builtIndex.match(/<link\s+rel="modulepreload"[^>]*>/g) || []),
        ...(builtIndex.match(/<link\s+rel="stylesheet"[^>]*>/g) || []),
      ].join('\n  ');

      const html404 = `<!doctype html>
<html lang="es" data-page="404">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Critical Self-Hosted Production Fonts -->
  <link rel="preload" as="font" type="font/woff2" href="/fonts/newsreader-var.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/fonts/newsreader-var-italic.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/fonts/schibsted-var.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/fonts/ibm-plex-mono-400.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/fonts/ibm-plex-mono-500.woff2" crossorigin />
  <link rel="preload" as="font" type="font/woff2" href="/fonts/ibm-plex-mono-600.woff2" crossorigin />

  <title>404 — Página no encontrada | Yeray Garrido</title>
  <meta name="description" content="Recurso no localizado en yeraygarrido.dev. Accede al portfolio principal, proyectos de ingeniería o publicaciones científicas." />
  <meta name="author" content="Yeray Garrido" />
  <meta name="robots" content="noindex, follow" />
  <meta name="theme-color" content="#09090B" />
  <meta name="color-scheme" content="dark light" />

  <link rel="icon" type="image/x-icon" href="/img/favicon.ico" />
  <link rel="icon" type="image/png" sizes="192x192" href="/img/android-chrome-192x192.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
  <link rel="manifest" href="/img/site.webmanifest" />

  <style>
    html, body {
      margin: 0;
      padding: 0;
      background-color: #09090B;
      color: #F6F4EF;
    }
  </style>
  ${assetTags}
</head>

<body>
  <div id="root"></div>

  <noscript>
    <main style="max-width:860px;margin:0 auto;padding:48px 24px;font-family:system-ui,sans-serif;background:#09090B;color:#F6F4EF;line-height:1.6;">
      <p style="font-family:monospace;font-size:13px;letter-spacing:0.14em;color:#D6C7B2;text-transform:uppercase;">HTTP 404 · RECURSO NO LOCALIZADO</p>
      <h1 style="font-size:48px;margin:12px 0;">404 — Página no encontrada</h1>
      <p style="color:rgba(246,244,239,0.82);">El recurso solicitado no existe, ha sido trasladado o su identificador ha cambiado en la última compilación de yeraygarrido.dev.</p>
      <ul style="margin-top:24px;line-height:2;">
        <li><a href="/" style="color:#D6C7B2;">Volver al Inicio</a></li>
        <li><a href="/#work" style="color:#D6C7B2;">Bide+ &amp; Proyectos</a></li>
        <li><a href="/papers/" style="color:#D6C7B2;">Publicaciones Científicas (Zenodo / Scholar)</a></li>
        <li><a href="/#contact" style="color:#D6C7B2;">Contacto</a></li>
      </ul>
      <p style="margin-top:24px;font-size:14px;color:rgba(246,244,239,0.6);">
        APIs públicas: <a href="/cv.json" style="color:#D6C7B2;">cv.json</a> · <a href="/cv.xml" style="color:#D6C7B2;">cv.xml</a> · <a href="/cv.txt" style="color:#D6C7B2;">cv.txt</a> · <a href="/llms.txt" style="color:#D6C7B2;">llms.txt</a>
      </p>
    </main>
  </noscript>
</body>

</html>
`;

      fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8');
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
      generate404HtmlPlugin(),
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
