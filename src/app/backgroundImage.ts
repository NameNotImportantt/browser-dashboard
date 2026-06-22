const MAX_SOURCE_BYTES = 8 * 1024 * 1024;
const MAX_EDGE_PX = 1920;
const JPEG_QUALITY = 0.82;

export class BackgroundImageError extends Error {
    public readonly code: 'invalidType' | 'tooLarge' | 'decodeFailed';

    public constructor(code: 'invalidType' | 'tooLarge' | 'decodeFailed') {
        super(code);
        this.code = code;
    }
}

function loadImageFromObjectUrl(objectUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () => reject(new BackgroundImageError('decodeFailed'));
        image.src = objectUrl;
    });
}

export async function prepareBackgroundImageDataUrl(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
        throw new BackgroundImageError('invalidType');
    }

    if (file.size > MAX_SOURCE_BYTES) {
        throw new BackgroundImageError('tooLarge');
    }

    const objectUrl = URL.createObjectURL(file);

    try {
        const image = await loadImageFromObjectUrl(objectUrl);
        const scale = Math.min(1, MAX_EDGE_PX / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));

        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        if (!context) {
            throw new BackgroundImageError('decodeFailed');
        }

        context.drawImage(image, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

        if (!dataUrl.startsWith('data:image/')) {
            throw new BackgroundImageError('decodeFailed');
        }

        return dataUrl;
    } finally {
        URL.revokeObjectURL(objectUrl);
    }
}
