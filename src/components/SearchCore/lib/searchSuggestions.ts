import {normalizeSearchHistoryQuery} from '@/data/searchHistory';
import type {SearchHistoryEntry} from '@/db';

export type SearchSuggestionSource = 'history' | 'online';

export interface SearchSuggestion {
  id: string;
  label: string;
  source: SearchSuggestionSource;
}

const MAX_SUGGESTIONS = 8;

type SearchSuggestionsJsonPrimitive = string | number | boolean | null;

interface SearchSuggestionsJsonObject {
  [key: string]: SearchSuggestionsJsonValue | undefined;
}

type SearchSuggestionsJsonValue =
    | SearchSuggestionsJsonPrimitive
    | SearchSuggestionsJsonObject
    | SearchSuggestionsJsonValue[];

function suggestionKey(label: string) {
    return normalizeSearchHistoryQuery(label);
}

function matchesQuery(haystack: string, normalized: string) {
    if (haystack.includes(normalized)) {
        return true;
    }

    const tokens = normalized.split(/\s+/).filter(Boolean);

    return tokens.length > 0 && tokens.every(token => haystack.includes(token));
}

function mapHistoryEntry(entry: SearchHistoryEntry): SearchSuggestion {
    return {
        id: `history:${entry.id}`,
        label: entry.query,
        source: 'history',
    };
}

export function getLocalSearchSuggestions(query: string, history: SearchHistoryEntry[]): SearchSuggestion[] {
    const normalized = normalizeSearchHistoryQuery(query);

    if (!normalized) {
        return history.slice(0, MAX_SUGGESTIONS).map(mapHistoryEntry);
    }

    const result: SearchSuggestion[] = [];
    const seen = new Set<string>();

    for (const entry of history) {
        const key = suggestionKey(entry.query);

        if (seen.has(key) || !matchesQuery(key, normalized)) {
            continue;
        }

        seen.add(key);
        result.push(mapHistoryEntry(entry));

        if (result.length >= MAX_SUGGESTIONS) {
            break;
        }
    }

    return result;
}

export async function fetchGoogleSuggestions(query: string, signal: AbortSignal): Promise<string[]> {
    const trimmed = query.trim();

    if (!trimmed) {
        return [];
    }

    const params = new URLSearchParams({
        client: 'firefox',
        q: trimmed,
    });

    const response = await fetch(`https://suggestqueries.google.com/complete/search?${params.toString()}`, {signal});

    if (!response.ok) {
        return [];
    }

    const data = await response.json() as SearchSuggestionsJsonValue;

    if (!Array.isArray(data) || !Array.isArray(data[1])) {
        return [];
    }

    return data[1].filter((item): item is string => typeof item === 'string');
}

export async function loadSearchSuggestions(
    query: string,
    history: SearchHistoryEntry[],
    signal: AbortSignal,
): Promise<SearchSuggestion[]> {
    const local = getLocalSearchSuggestions(query, history);
    const trimmed = query.trim();

    if (!trimmed) {
        return local;
    }

    const seen = new Set(local.map(item => suggestionKey(item.label)));
    const result = [...local];

    try {
        const online = await fetchGoogleSuggestions(trimmed, signal);

        for (const label of online) {
            const key = suggestionKey(label);

            if (seen.has(key)) {
                continue;
            }

            seen.add(key);
            result.push({
                id: `online:${key}`,
                label,
                source: 'online',
            });

            if (result.length >= MAX_SUGGESTIONS) {
                break;
            }
        }
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw error;
        }
    }

    return result.slice(0, MAX_SUGGESTIONS);
}
