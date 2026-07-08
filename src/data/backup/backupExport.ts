import {setLastBackupExportedAt} from '../settings/settingsRepository';
import {loadSnapshot} from '../snapshot';
import {
    BACKUP_APP_NAME,
    BACKUP_MIME_TYPE,
    BACKUP_SCHEMA_VERSION,
} from './backupSchema';
import type {
    DashboardBackupDownloadPayload,
    DashboardBackupEnvelope,
    DashboardBackupSettings,
} from './backupSchema';

function padNumber(value: number) {
    return value.toString().padStart(2, '0');
}

function buildBackupFileName(exportedAt: number) {
    const date = new Date(exportedAt);
    const year = date.getFullYear();
    const month = padNumber(date.getMonth() + 1);
    const day = padNumber(date.getDate());
    const hours = padNumber(date.getHours());
    const minutes = padNumber(date.getMinutes());
    const seconds = padNumber(date.getSeconds());

    return `browser-dashboard-backup-${year}-${month}-${day}-${hours}${minutes}${seconds}.json`;
}

export async function createDashboardBackupEnvelope(): Promise<DashboardBackupEnvelope> {
    const exportedAt = Date.now();
    const snapshot = await loadSnapshot();
    const {weatherApiKey, ...settings} = snapshot.settings;

    void weatherApiKey;
    const sanitizedSettings: DashboardBackupSettings = settings;

    return {
        schemaVersion: BACKUP_SCHEMA_VERSION,
        exportedAt,
        appName: BACKUP_APP_NAME,
        data: {
            ...snapshot,
            settings: sanitizedSettings,
        },
    };
}

export async function createDashboardBackupDownloadPayload(): Promise<DashboardBackupDownloadPayload> {
    const envelope = await createDashboardBackupEnvelope();
    const json = JSON.stringify(envelope, null, 2);

    return {
        blob: new Blob([json], {type: BACKUP_MIME_TYPE}),
        fileName: buildBackupFileName(envelope.exportedAt),
        json,
        exportedAt: envelope.exportedAt,
        mimeType: BACKUP_MIME_TYPE,
    };
}

export async function markDashboardBackupExported(exportedAt = Date.now()) {
    return setLastBackupExportedAt(exportedAt);
}
