import {VitePWA} from 'vite-plugin-pwa';
import {createViteConfig} from './shared';

export default createViteConfig({
    inlineAssets: false,
    outDir: '../dist-vite',
    pwaEnabled: true,
    publicDir: '../public-multi',
    plugins: [
        VitePWA({
            injectRegister: false,
            registerType: 'autoUpdate',
            manifest: {
                name: 'Browser Dashboard',
                short_name: 'Dashboard',
                display: 'standalone',
                start_url: './',
                scope: './',
                theme_color: '#070a11',
                background_color: '#070a11',
                icons: [
                    {
                        src: 'icons/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            pwaAssets: {
                disabled: true,
            },
            workbox: {
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                navigateFallback: 'index.html',
                globPatterns: ['**/*.{html,js,css,ico,png,webmanifest}'],
                skipWaiting: true,
                // Keep offline support limited to local app shell assets.
                // Weather, online suggestions, and remote favicons stay best-effort.
                runtimeCaching: [],
            },
        }),
    ],
});
