import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [
      react(), 
      tailwindcss(),
      cssInjectedByJsPlugin() // se supone que me va a ayudar para el seo
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      cssCodeSplit: true, 
      // Limpieza de la consola en producción para ahorrar ejecución de JS mediante terser
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // SEPARACIÓN DE LIBRERÍAS PESADAS 
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Separamos GSAP pesado y se usa poco
              if (id.includes('gsap')) return 'vendor-gsap';
              // el calendario de GitHub que tarda mas en procesarse se separa de los demas componentes
              if (id.includes('react-github-calendar')) return 'vendor-github';
              // El resto de librerías base (React, etc)
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