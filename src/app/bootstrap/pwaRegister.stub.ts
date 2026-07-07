type UpdateServiceWorker = (reloadPage?: boolean) => Promise<void>;

export function registerSW(): UpdateServiceWorker {
    return async () => undefined;
}
