import {db} from '@/db';
import {createId} from '@/lib';
import {SEARCH_HISTORY_LIMIT} from './constants';
import {normalizeSearchHistoryQuery} from './lib/normalizeSearchHistoryQuery';
import type {SearchHistoryEntry} from '@/db';

export async function addSearchHistoryEntry(query: string) {
    const trimmed = query.trim();
    const normalizedQuery = normalizeSearchHistoryQuery(query);

    if (!trimmed) {
        return;
    }

    const settings = await db.settings.get('app');

    if (settings?.searchHistoryEnabled === false) {
        return;
    }

    const now = Date.now();
    const existing = await db.searchHistory.where('normalizedQuery').equals(normalizedQuery).first();

    if (existing) {
        await db.searchHistory.update(existing.id, {
            query: trimmed,
            normalizedQuery,
            usedAt: now,
        });
    } else {
        await db.searchHistory.add({
            id: createId(),
            query: trimmed,
            normalizedQuery,
            usedAt: now,
        });
    }

    const count = await db.searchHistory.count();

    if (count > SEARCH_HISTORY_LIMIT) {
        const overflow = await db.searchHistory.orderBy('usedAt').limit(count - SEARCH_HISTORY_LIMIT).toArray();

        await db.searchHistory.bulkDelete(overflow.map(entry => entry.id));
    }
}

export async function listSearchHistoryEntries() {
    return db.searchHistory.orderBy('usedAt').reverse().toArray();
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

    await db.searchHistory.bulkPut(entries.map(entry => ({
        ...entry,
        normalizedQuery: entry.normalizedQuery ?? normalizeSearchHistoryQuery(entry.query),
    })));
}
