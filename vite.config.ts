import preact from '@preact/preset-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import Unfonts from 'unplugin-fonts/vite';
import { defineConfig, normalizePath } from 'vite';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';

import { viteStaticCopy } from 'vite-plugin-static-copy';
import { VitePWA } from 'vite-plugin-pwa';

const staticFolderCopyOptions = {
  targets: [
    {
      src: normalizePath(
        path.resolve(import.meta.dirname, './src/assets/icons')
      ),
      dest: './assets'
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
      Unfonts({
        custom: {
          families: [
            {
              name: 'pixelmplus10',
              local: 'sans-serif',
              src: './src/assets/fonts/*'
            }
          ],
          preload: true
        }
      }),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
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
              src: '/assets/icons/android-chrome-192x192.png',
              type: 'image/png',
              sizes: '192x192',
              purpose: 'any maskable'
            },
            {
              src: '/assets/icons/android-chrome-512x512.png',
              type: 'image/png',
              sizes: '512x512'
            },
            {
              src: '/assets/icons/android-36x36.png',
              type: 'image/png',
              sizes: '36x36'
            },
            {
              src: '/assets/icons/android-48x48.png',
              type: 'image/png',
              sizes: '48x48'
            },
            {
              src: '/assets/icons/android-72x72.png',
              type: 'image/png',
              sizes: '72x72'
            },
            {
              src: '/assets/icons/android-96x96.png',
              type: 'image/png',
              sizes: '96x96'
            },
            {
              src: '/assets/icons/android-144x144.png',
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
            if (/\.woff2?$/.test(fileName)) {
              return 'assets/fonts/[name]-[hash][extname]';
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
