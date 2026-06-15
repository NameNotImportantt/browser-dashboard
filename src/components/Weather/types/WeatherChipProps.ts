import type { WeatherCache } from "@/db/types/weather";

export interface WeatherChipProps {
  weather: WeatherCache | null;
  onRefresh: () => void;
}
