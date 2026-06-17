import { t, weatherCodeToEmoji } from "@/app";
import type { TopBarProps } from "./types/TopBarProps";
import styles from "./TopBar.module.scss";

export function TopBar({ locale, time, date, weather, onRefreshWeather }: TopBarProps) {
  return (
    <header className={styles.topBar} aria-label={t(locale, "topBarAriaLabel")}>
      <strong className={styles.time}>{time}</strong>
      <span className={styles.date}>{date}</span>
      <button
        type="button"
        className={styles.weather}
        onClick={() => void onRefreshWeather()}
        aria-label={t(locale, "refreshWeather")}
      >
        {weather ? (
          <>
            <span aria-hidden>{weatherCodeToEmoji(weather.weatherCode)}</span>
            <span>{Math.round(weather.temperatureC)}°</span>
          </>
        ) : (
          <span>- -</span>
        )}
      </button>
    </header>
  );
}
