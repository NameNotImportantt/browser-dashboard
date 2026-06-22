export const WEATHER_CACHE_TTL_MS = 30 * 60 * 1000;

export function createId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function dateToKey(date: Date) {
    return todayKey(date);
}

export function getHabitStreak(completionDates: string[], today = todayKey()) {
    if (completionDates.length === 0) {
        return 0;
    }

    const completionSet = new Set(completionDates);
    const cursor = new Date(`${today}T12:00:00`);

    if (!completionSet.has(today)) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;

    while (completionSet.has(dateToKey(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}

export function reorderIds(ids: string[], fromId: string, toId: string) {
    if (fromId === toId) {
        return ids;
    }

    const fromIndex = ids.indexOf(fromId);
    const toIndex = ids.indexOf(toId);

    if (fromIndex === -1 || toIndex === -1) {
        return ids;
    }

    const draft = [...ids];
    const [moved] = draft.splice(fromIndex, 1);

    if (moved === undefined) {
        return ids;
    }

    draft.splice(toIndex, 0, moved);

    return draft;
}

export function weatherCodeToEmoji(code: number) {
    if (code === 0) {return '☀';}

    if (code <= 3) {return '⛅';}

    if (code <= 48) {return '🌫';}

    if (code <= 67) {return '🌧';}

    if (code <= 77) {return '❄';}

    if (code <= 82) {return '🌧';}

    if (code <= 99) {return '⛈';}

    return '🌡';
}

export function normalizeUrl(raw: string) {
    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }

    return `https://${raw}`;
}
