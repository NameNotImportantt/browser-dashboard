export { BackgroundImageError, prepareBackgroundImageDataUrl } from "./backgroundImage";
export { t } from "./i18n";
export { buildSearchUrl, getSearchEngineOptions, isValidSearchUrlTemplate, SEARCH_URL_HINT } from "./searchUtils";
export { fetchGoogleSuggestionsJsonp, getLocalSearchSuggestions, loadSearchSuggestions, SEARCH_HISTORY_LIMIT } from "./searchSuggestions";
export type { SearchSuggestion, SearchSuggestionSource } from "./searchSuggestions";
export {
  DEFAULT_SETTINGS,
  DEFAULT_TAB_TITLE,
  formatClockLabels,
  geocodeCity,
  mergeSettings,
} from "./settingsDefaults";
export {
  applyCustomTextColors,
  getTextColorSwatches,
  normalizeHexColor,
  resolveTextColor,
  THEME_TEXT_COLORS,
} from "./themeTextColors";
export {
  createId,
  getHabitStreak,
  normalizeUrl,
  reorderIds,
  todayKey,
  weatherCodeToEmoji,
  WEATHER_CACHE_TTL_MS,
} from "./utils";
export { runSmokeChecks } from "./smokeChecks";
export { AppShell } from "./AppShell";
