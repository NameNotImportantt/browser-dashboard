import {mergeSettings} from '@/app';
import {db, type Note} from '@/db';
import {
    BACKUP_SCHEMA_VERSION,
    DashboardBackupError,
    type DashboardBackupNote,
    type DashboardBackupEnvelope,
} from './backupSchema';
import {isDashboardBackupEnvelope} from './backupValidators';
import type {BackupJsonValue} from './backupJsonValue';

function normalizeImportedNotes(notes: DashboardBackupNote[]): Note[] {
    const positionsByWorkspaceId = new Map<string, number>();

    return notes
        .sort((firstNote, secondNote) => {
            if (firstNote.workspaceId !== secondNote.workspaceId) {
                return firstNote.workspaceId.localeCompare(secondNote.workspaceId);
            }

            return firstNote.updatedAt - secondNote.updatedAt;
        })
        .map(note => {
            const nextPosition = positionsByWorkspaceId.get(note.workspaceId) ?? 0;
            const updatedAt = note.updatedAt;

            positionsByWorkspaceId.set(note.workspaceId, nextPosition + 1);

            return {
                id: note.id,
                workspaceId: note.workspaceId,
                title: note.title ?? '',
                text: note.text,
                createdAt: note.createdAt ?? updatedAt,
                updatedAt,
                position: note.position ?? nextPosition,
            };
        });
}

export function parseDashboardBackupJson(json: string): DashboardBackupEnvelope {
    let parsed: BackupJsonValue;

    try {
        parsed = JSON.parse(json) as BackupJsonValue;
    } catch {
        throw new DashboardBackupError('invalidJson', 'Backup JSON could not be parsed.');
    }

    if (!isDashboardBackupEnvelope(parsed)) {
        throw new DashboardBackupError('invalidEnvelope', 'Backup file has an invalid structure.');
    }

    if (parsed.schemaVersion !== BACKUP_SCHEMA_VERSION) {
        throw new DashboardBackupError('unsupportedSchemaVersion', 'Backup schema version is not supported.');
    }

    return parsed;
}

export async function importDashboardBackup(envelope: DashboardBackupEnvelope) {
    const settings = mergeSettings(envelope.data.settings);
    const notes = normalizeImportedNotes(envelope.data.notes);

    try {
        await db.transaction(
            'rw',
            [
                db.workspaces,
                db.todos,
                db.habits,
                db.bookmarks,
                db.bookmarkCategories,
                db.notes,
                db.settings,
                db.weatherCache,
                db.searchHistory,
            ],
            async () => {
                await Promise.all([
                    db.workspaces.clear(),
                    db.todos.clear(),
                    db.habits.clear(),
                    db.bookmarks.clear(),
                    db.bookmarkCategories.clear(),
                    db.notes.clear(),
                    db.settings.clear(),
                    db.weatherCache.clear(),
                    db.searchHistory.clear(),
                ]);

                if (envelope.data.workspaces.length > 0) {
                    await db.workspaces.bulkPut(envelope.data.workspaces);
                }

                if (envelope.data.todos.length > 0) {
                    await db.todos.bulkPut(envelope.data.todos);
                }

                if (envelope.data.habits.length > 0) {
                    await db.habits.bulkPut(envelope.data.habits);
                }

                if (envelope.data.bookmarks.length > 0) {
                    await db.bookmarks.bulkPut(envelope.data.bookmarks);
                }

                if (envelope.data.bookmarkCategories.length > 0) {
                    await db.bookmarkCategories.bulkPut(envelope.data.bookmarkCategories);
                }

                if (notes.length > 0) {
                    await db.notes.bulkPut(notes);
                }

                await db.settings.put(settings);

                if (envelope.data.weatherCache) {
                    await db.weatherCache.put(envelope.data.weatherCache);
                }

                if (envelope.data.searchHistory.length > 0) {
                    await db.searchHistory.bulkPut(envelope.data.searchHistory);
                }
            },
        );
    } catch (error) {
        if (error instanceof DashboardBackupError) {
            throw error;
        }

        throw new DashboardBackupError('importFailed', 'Backup import failed.');
    }
}
