import type {WeatherLocation} from './weather';

export type ThemeMode = 'light' | 'dark';

export type TimeFormat = '12h' | '24h';

export type AppLocale = 'ru' | 'en';

export type DateFormatPreset = 'dd.MM.yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';

export interface CustomSearchEngine {
  id: string;
  name: string;
  urlTemplate: string;
}

export type TextColorKey = 'text' | 'textSoft' | 'textMuted';

export interface CustomTextColors {
  text: string | null;
  textSoft: string | null;
  textMuted: string | null;
}

export interface AppSettings {
  key: 'app';
  theme: ThemeMode;
  activeSearchEngineId: string;
  customSearchEngines: CustomSearchEngine[];
  searchOpenInNewTab: boolean;
  onlineSearchSuggestionsEnabled: boolean;
  searchHistoryEnabled: boolean;
  bookmarkFaviconsEnabled: boolean;
  backupReminderEnabled: boolean;
  backupReminderIntervalDays: number;
  lastBackupExportedAt: number | null;
  timeFormat: TimeFormat;
  timezone: string;
  locale: AppLocale;
  dateFormat: DateFormatPreset;
  tabTitle: string;
  lastWorkspaceId: string | null;
  weatherLocation: WeatherLocation | null;
  customBackgroundImage: string | null;
  backgroundScrimOpacity: number;
  customTextColors: CustomTextColors | null;
  updatedAt: number;
}
