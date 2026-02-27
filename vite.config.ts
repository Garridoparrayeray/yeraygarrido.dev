import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
// aumenta el tamaño del chunk principal y genera ~42 KiB de CSS "unused"
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      cssCodeSplit: false, // Un solo CSS cacheado independiente del JS
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
              // GSAP + ScrollTrigger: pesado, solo necesario tras el primer scroll
              if (id.includes('gsap')) return 'vendor-gsap';
              // Lenis: smooth scroll, no bloquea el primer paint
              if (id.includes('lenis')) return 'vendor-lenis';
              // GitHub Calendar: componente lazy cargado muy tarde en la página
              if (id.includes('react-github-calendar')) return 'vendor-github';
              // React core: necesario siempre, chunk pequeño y muy cacheado
              if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';
              // Resto de dependencias
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
