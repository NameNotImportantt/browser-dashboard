import type {AppSettings} from '@/db';

const DAY_MS = 24 * 60 * 60 * 1000;

export function getBackupReminderDueAt(settings: AppSettings) {
    if (settings.lastBackupExportedAt === null) {
        return null;
    }

    return settings.lastBackupExportedAt + settings.backupReminderIntervalDays * DAY_MS;
}

export function isBackupReminderOverdue(settings: AppSettings, now = Date.now()) {
    if (!settings.backupReminderEnabled) {
        return false;
    }

    const dueAt = getBackupReminderDueAt(settings);

    if (dueAt === null) {
        return true;
    }

    return now >= dueAt;
}
