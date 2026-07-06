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
            manifest: false,
            pwaAssets: {
                disabled: true,
            },
        }),
    ],
});
