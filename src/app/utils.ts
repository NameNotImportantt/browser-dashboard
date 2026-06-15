export const WEATHER_CACHE_TTL_MS = 30 * 60 * 1000;

export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
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

export function getGreetingByHour(hour: number) {
  if (hour < 6) {
    return "Доброй ночи";
  }

  if (hour < 12) {
    return "Доброе утро";
  }

  if (hour < 18) {
    return "Добрый день";
  }

  return "Добрый вечер";
}

export function weatherCodeToLabel(code: number) {
  if (code === 0) return "Ясно";
  if (code <= 3) return "Переменная облачность";
  if (code <= 48) return "Туман";
  if (code <= 67) return "Дождь";
  if (code <= 77) return "Снег";
  if (code <= 82) return "Ливень";
  if (code <= 99) return "Гроза";
  return "Неизвестно";
}

export function weatherCodeToEmoji(code: number) {
  if (code === 0) return "☀";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫";
  if (code <= 67) return "🌧";
  if (code <= 77) return "❄";
  if (code <= 82) return "🌧";
  if (code <= 99) return "⛈";
  return "🌡";
}

export function normalizeUrl(raw: string) {
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return `https://${raw}`;
}
