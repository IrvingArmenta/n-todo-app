import preact from '@preact/preset-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, normalizePath } from 'vite';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';

import { viteStaticCopy } from 'vite-plugin-static-copy';
import { VitePWA } from 'vite-plugin-pwa';

const staticFolderCopyOptions = {
  targets: [
    {
      src: normalizePath(path.resolve(import.meta.dirname, './public/icons')),
      dest: '.'
    }
  ]
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProductionMode = mode === 'production';

  return {
    plugins: [
      preact(),
      svgr(),
      tsconfigPaths(),
      isProductionMode && viteStaticCopy(staticFolderCopyOptions),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        devOptions: {
          enabled: true
        },
        manifest: {
          name: 'N-TodoApp+',
          short_name: 'N-TodoApp+',
          start_url: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#e6e6e6',
          theme_color: '#fff',
          icons: [
            {
              src: '/icons/android-chrome-192x192.png',
              type: 'image/png',
              sizes: '192x192',
              purpose: 'any maskable'
            },
            {
              src: '/icons/android-chrome-512x512.png',
              type: 'image/png',
              sizes: '512x512'
            },
            {
              src: '/icons/android-36x36.png',
              type: 'image/png',
              sizes: '36x36'
            },
            {
              src: '/icons/android-48x48.png',
              type: 'image/png',
              sizes: '48x48'
            },
            {
              src: '/icons/android-72x72.png',
              type: 'image/png',
              sizes: '72x72'
            },
            {
              src: '/icons/android-96x96.png',
              type: 'image/png',
              sizes: '96x96'
            },
            {
              src: '/icons/android-144x144.png',
              type: 'image/png',
              sizes: '144x144'
            }
          ]
        }
      })
    ],
    build: {
      emptyOutDir: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          assetFileNames: ({ names }) => {
            const fileName = names?.[0] ?? '';
            if (/\.css$/.test(fileName)) {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
          manualChunks: {
            animejs: ['animejs'],
            dayjs: ['dayjs'],
            dexie: ['dexie'],
            dexieHooks: ['dexie-react-hooks'],
            preact: ['preact'],
            preactRouter: ['preact-router'],
            flipMove: ['react-flip-move'],
            transitionGroup: ['react-transition-group'],
            cookie: ['tiny-cookie']
          }
        }
      }
    }
  };
});
