import type { AppLocale, WeatherCache } from "@/db/types";

export interface TopBarProps {
  locale: AppLocale;
  time: string;
  date: string;
  weather: WeatherCache | null;
  onRefreshWeather: () => Promise<void>;
}
