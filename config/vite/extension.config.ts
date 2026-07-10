import {createViteConfig} from './shared';

export default createViteConfig({
    inlineAssets: false,
    outDir: '../dist-extension',
    pwaEnabled: false,
    publicDir: '../public',
});
