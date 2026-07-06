import {createViteConfig} from './config/vite/shared';

export default createViteConfig({
    inlineAssets: true,
    outDir: '../dist',
    pwaEnabled: false,
});
