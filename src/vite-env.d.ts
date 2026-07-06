/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PWA_ENABLED: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
