import {createId, SEARCH_HISTORY_LIMIT} from '@/app';
import {db} from '@/db';

export async function addSearchHistoryEntry(query: string) {
    const normalized = query.trim();

    if (!normalized) {
        return;
    }

    const now = Date.now();
    const entries = await db.searchHistory.toArray();
    const existing = entries.find(entry => entry.query.toLowerCase() === normalized.toLowerCase());

    if (existing) {
        await db.searchHistory.update(existing.id, {usedAt: now});
    } else {
        await db.searchHistory.add({
            id: createId(),
            query: normalized,
            usedAt: now,
        });
    }

    const count = await db.searchHistory.count();

    if (count > SEARCH_HISTORY_LIMIT) {
        const overflow = await db.searchHistory.orderBy('usedAt').limit(count - SEARCH_HISTORY_LIMIT).toArray();

        await db.searchHistory.bulkDelete(overflow.map(entry => entry.id));
    }
}
