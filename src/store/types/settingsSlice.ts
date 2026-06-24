import type {AppLocale, DateFormatPreset, TextColorKey, ThemeMode, TimeFormat} from '@/db';

export interface SettingsSlice {
  setTheme: (theme: ThemeMode) => Promise<void>;
  setActiveSearchEngineId: (activeSearchEngineId: string) => Promise<void>;
  setOnlineSearchSuggestionsEnabled: (onlineSearchSuggestionsEnabled: boolean) => Promise<void>;
  setSearchHistoryEnabled: (searchHistoryEnabled: boolean) => Promise<void>;
  setBookmarkFaviconsEnabled: (bookmarkFaviconsEnabled: boolean) => Promise<void>;
  setBackupReminderEnabled: (backupReminderEnabled: boolean) => Promise<void>;
  setBackupReminderIntervalDays: (backupReminderIntervalDays: number) => Promise<void>;
  setLastBackupExportedAt: (lastBackupExportedAt: number | null) => Promise<void>;
  setTimeFormat: (timeFormat: TimeFormat) => Promise<void>;
  setTimezone: (timezone: string) => Promise<void>;
  setLocale: (locale: AppLocale) => Promise<void>;
  setDateFormat: (dateFormat: DateFormatPreset) => Promise<void>;
  setTabTitle: (tabTitle: string) => Promise<void>;
  setBackgroundImageFromFile: (file: File) => Promise<void>;
  clearBackgroundImage: () => Promise<void>;
  setBackgroundScrimOpacity: (backgroundScrimOpacity: number) => Promise<void>;
  setTextColor: (key: TextColorKey, value: string | null) => Promise<void>;
  resetTextColors: () => Promise<void>;
  addCustomSearchEngine: (payload: { name: string; urlTemplate: string }) => Promise<void>;
  removeCustomSearchEngine: (engineId: string) => Promise<void>;
}
