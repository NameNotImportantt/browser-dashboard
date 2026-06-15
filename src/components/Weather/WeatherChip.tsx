import { weatherCodeToLabel } from "@/app/utils";
import type { WeatherChipProps } from "@/components/Weather/types/WeatherChipProps";
import styles from "./WeatherChip.module.scss";

export function WeatherChip({ weather, onRefresh }: WeatherChipProps) {
  if (!weather) {
    return (
      <button className={styles.weatherChip} onClick={onRefresh} type="button">
        - -
      </button>
    );
  }

  return (
    <button className={styles.weatherChip} onClick={onRefresh} type="button">
      <span>{Math.round(weather.temperatureC)}°C</span>
      <span>{weatherCodeToLabel(weather.weatherCode)}</span>
    </button>
  );
}
