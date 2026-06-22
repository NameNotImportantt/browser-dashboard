import {readFileSync} from 'node:fs';
import {fileURLToPath, URL} from 'node:url';
import react from '@vitejs/plugin-react';
import {defineConfig, type Plugin} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

const favicon16Path = fileURLToPath(
    new URL('./src/assets/favicon-16x16.png', import.meta.url),
);
const favicon32Path = fileURLToPath(
    new URL('./src/assets/favicon-32x32.png', import.meta.url),
);

function inlineFavicon(): Plugin {
    return {
        name: 'inline-favicon',
        transformIndexHtml(html) {
            const favicon16 = readFileSync(favicon16Path).toString('base64');
            const favicon32 = readFileSync(favicon32Path).toString('base64');

            return html.replace(
                /<!-- inline-favicon -->/,
        `<link rel="icon" type="image/png" sizes="16x16" href="data:image/png;base64,${favicon16}" />
    <link rel="icon" type="image/png" sizes="32x32" href="data:image/png;base64,${favicon32}" />`,
            );
        },
    };
}

export default defineConfig({
    root: './src',
    publicDir: false,
    plugins: [react(), inlineFavicon(), viteSingleFile()],
    base: './',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
