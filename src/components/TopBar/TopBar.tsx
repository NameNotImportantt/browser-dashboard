import {useSettings, useWeather} from '@/dashboard';
import {useClock} from '@/hooks';
import {t} from '@/i18n';
import {weatherCodeToEmoji} from './lib/weatherCodeToEmoji';
import styles from './TopBar.module.scss';

export function TopBar() {
    const {settings, locale} = useSettings();
    const {weather, refreshWeather} = useWeather();

    const {dateLabel, timeLabel} = useClock({
        locale,
        timeFormat: settings.timeFormat,
        dateFormat: settings.dateFormat,
        timezone: settings.timezone,
    });

    return (
        <header className={styles.topBar} aria-label={t(locale, 'topBarAriaLabel')}>
            <strong className={styles.time}>{timeLabel}</strong>
            <span className={styles.date}>{dateLabel}</span>
            <button
                type="button"
                className={styles.weather}
                onClick={() => {
                    void refreshWeather(true).catch(() => undefined);
                }}
                aria-label={t(locale, 'refreshWeather')}
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
