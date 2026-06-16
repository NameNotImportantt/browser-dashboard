import type { AppSettings } from "@/db/types/settings";

export interface SettingsPanelProps {
  settings: AppSettings;
  onTimeFormatChange: (value: AppSettings["timeFormat"]) => Promise<void>;
  onTimezoneChange: (value: string) => Promise<void>;
  onLocaleChange: (value: AppSettings["locale"]) => Promise<void>;
  onDateFormatChange: (value: AppSettings["dateFormat"]) => Promise<void>;
  onTabTitleChange: (value: string) => Promise<void>;
  onActiveSearchEngineChange: (engineId: string) => Promise<void>;
  onAddCustomSearchEngine: (payload: { name: string; urlTemplate: string }) => Promise<void>;
  onRemoveCustomSearchEngine: (engineId: string) => Promise<void>;
  onWeatherCityChange: (city: string) => Promise<void>;
}
