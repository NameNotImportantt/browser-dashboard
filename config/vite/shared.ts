import {readFileSync} from 'node:fs';
import {fileURLToPath, URL} from 'node:url';
import react from '@vitejs/plugin-react';
import {defineConfig, type Plugin, type PluginOption, type UserConfigExport} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

const favicon16Path = fileURLToPath(
    new URL('../../src/assets/favicon-16x16.png', import.meta.url),
);
const favicon32Path = fileURLToPath(
    new URL('../../src/assets/favicon-32x32.png', import.meta.url),
);

interface CreateViteConfigOptions {
    inlineAssets: boolean;
    outDir: string;
}

function createFaviconLinks(inlineAssets: boolean) {
    if (inlineAssets) {
        const favicon16 = readFileSync(favicon16Path).toString('base64');
        const favicon32 = readFileSync(favicon32Path).toString('base64');

        return `<link rel="icon" type="image/png" sizes="16x16" href="data:image/png;base64,${favicon16}" />
    <link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,${favicon32}" />`;
    }

    return `<link rel="icon" type="image/png" sizes="16x16" href="./assets/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="./assets/favicon-32x32.png" />`;
}

function createFaviconPlugin(inlineAssets: boolean): Plugin {
    return {
        name: inlineAssets ? 'inline-favicon' : 'linked-favicon',
        transformIndexHtml(html) {
            return html.replace(
                /<!-- inline-favicon -->/,
                createFaviconLinks(inlineAssets),
            );
        },
    };
}

export function createViteConfig({inlineAssets, outDir}: CreateViteConfigOptions): UserConfigExport {
    const plugins: PluginOption[] = [
        react(),
        createFaviconPlugin(inlineAssets),
        ...(inlineAssets ? [viteSingleFile()] : []),
    ];

    return defineConfig({
        root: './src',
        publicDir: false,
        plugins,
        base: './',
        build: {
            outDir,
            emptyOutDir: true,
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('../../src', import.meta.url)),
            },
        },
    });
}
