import {db} from '@/db';
import {createId} from '@/lib';
import {SEARCH_HISTORY_LIMIT} from './constants';
import type {SearchHistoryEntry} from '@/db';

export async function addSearchHistoryEntry(query: string) {
    const normalized = query.trim();

    if (!normalized) {
        return;
    }

    const settings = await db.settings.get('app');

    if (settings?.searchHistoryEnabled === false) {
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

export async function deleteSearchHistoryEntry(entryId: string) {
    await db.searchHistory.delete(entryId);
}

export async function deleteSearchHistoryEntries(entryIds: string[]) {
    if (!entryIds.length) {
        return;
    }

    await db.searchHistory.bulkDelete(entryIds);
}

export async function clearSearchHistory() {
    await db.searchHistory.clear();
}

export async function restoreSearchHistoryEntries(entries: SearchHistoryEntry[]) {
    if (!entries.length) {
        return;
    }

    await db.searchHistory.bulkPut(entries);
}
