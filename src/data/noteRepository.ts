import {createId} from '@/app';
import {db} from '@/db';

export async function saveNote(text: string, activeWorkspaceId: string | null) {
    if (!activeWorkspaceId) {return;}

    const now = Date.now();
    const existing = await db.notes.where('workspaceId').equals(activeWorkspaceId).first();

    if (existing) {
        await db.notes.update(existing.id, {
            text,
            updatedAt: now,
        });
    } else {
        await db.notes.add({
            id: createId(),
            workspaceId: activeWorkspaceId,
            text,
            updatedAt: now,
        });
    }
}
