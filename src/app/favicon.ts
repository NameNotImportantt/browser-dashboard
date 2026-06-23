export function resolveBookmarkFaviconUrl(bookmarkUrl: string) {
    try {
        const {hostname} = new URL(bookmarkUrl);

        return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`;
    } catch {
        return null;
    }
}
