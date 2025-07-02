/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/preact" />
/// <reference types="vitest-dom/extend-expect" />

declare module 'virtual:pwa-register/preact' {
  import type { StateUpdater } from 'preact/hooks';
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

  export type { RegisterSWOptions };

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, StateUpdater<boolean>];
    offlineReady: [boolean, StateUpdater<boolean>];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}
