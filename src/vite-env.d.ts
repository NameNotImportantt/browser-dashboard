/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
    readonly VITE_PWA_ENABLED: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
