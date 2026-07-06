/**
 * Entry point for the React app — see `src/index.html`.
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {runSmokeChecks} from '@/app';
import {App} from './App';

const elem = document.getElementById('root')!;

const app = (
    <StrictMode>
        <App />
    </StrictMode>
);

function canRegisterServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        return false;
    }

    const {hostname, protocol} = window.location;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

    return protocol === 'https:' || isLocalhost;
}

function registerServiceWorker() {
    if (!import.meta.env.PROD || !import.meta.env.VITE_PWA_ENABLED || !canRegisterServiceWorker()) {
        return;
    }

    void navigator.serviceWorker.register('./sw.js');
}

if (import.meta.hot) {
    // With hot module reloading, `import.meta.hot.data` is persisted.
    const root = (import.meta.hot.data.root ??= createRoot(elem));

    root.render(app);
} else {
    // The hot module reloading API is not available in production.
    createRoot(elem).render(app);
}

registerServiceWorker();
void runSmokeChecks();
