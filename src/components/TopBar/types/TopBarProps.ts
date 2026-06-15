import type { WeatherCache } from "@/db/types/weather";

export interface TopBarProps {
  time: string;
  date: string;
  weather: WeatherCache | null;
  onRefreshWeather: () => Promise<void>;
}
