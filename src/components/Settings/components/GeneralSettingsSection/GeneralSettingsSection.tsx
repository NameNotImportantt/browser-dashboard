import {useEffect, useMemo, useState} from 'react';
import {t} from '@/app';
import {Select} from '@/components/Select';
import {useSettings, useWeather} from '@/dashboard';
import styles from '../../SettingsPanel.module.scss';

export function GeneralSettingsSection() {
    const {settings, setLocale, setTabTitle: saveSettingsTabTitle} = useSettings();
    const {setWeatherCity: saveWeatherCity} = useWeather();
    const locale = settings.locale;
    const [tabTitle, setTabTitle] = useState(settings.tabTitle);
    const [weatherCity, setWeatherCity] = useState(settings.weatherLocation?.label ?? '');
    const [weatherError, setWeatherError] = useState<string | null>(null);

    useEffect(() => {
        setTabTitle(settings.tabTitle);
        setWeatherCity(settings.weatherLocation?.label ?? '');
    }, [settings.tabTitle, settings.weatherLocation?.label]);

    const localeOptions = useMemo(
        () => [
            {value: 'ru', label: 'Русский'},
            {value: 'en', label: 'English'},
        ],
        [],
    );

    const saveTabTitle = async () => {
        await saveSettingsTabTitle(tabTitle);
    };

    const lookupWeatherCity = async () => {
        setWeatherError(null);

        try {
            await saveWeatherCity(weatherCity);
        } catch (error) {
            setWeatherError(error instanceof Error ? error.message : 'Ошибка');
        }
    };

    return (
        <section className={`${styles.section} ${styles.sectionFirst}`}>
            <h3>{t(locale, 'settingsGeneral')}</h3>
            <div className={styles.grid}>
                <div className={styles.field}>
                    <span className={styles.fieldLabel}>{t(locale, 'locale')}</span>
                    <Select
                        value={settings.locale}
                        options={localeOptions}
                        onChange={value => void setLocale(value as typeof settings.locale)}
                        ariaLabel={t(locale, 'locale')}
                    />
                </div>

                <label className={styles.field}>
                    <span className={styles.fieldLabel}>{t(locale, 'tabTitle')}</span>
                    <div className={styles.inlineRow}>
                        <input value={tabTitle} onChange={event => setTabTitle(event.target.value)} />
                        <button type="button" onClick={() => void saveTabTitle()}>
                            {t(locale, 'save')}
                        </button>
                    </div>
                </label>

                <div className={styles.field}>
                    <span className={styles.fieldLabel}>{t(locale, 'weatherCity')}</span>
                    <div className={styles.inlineRow}>
                        <input
                            value={weatherCity}
                            onChange={event => setWeatherCity(event.target.value)}
                            placeholder={t(locale, 'weatherCityPlaceholder')}
                        />
                        <button type="button" onClick={() => void lookupWeatherCity()}>
                            {t(locale, 'lookupCity')}
                        </button>
                    </div>
                    {settings.weatherLocation ? <small className={styles.hint}>{settings.weatherLocation.label}</small> : null}
                    {weatherError ? <small className={styles.error}>{weatherError}</small> : null}
                </div>
            </div>
        </section>
    );
}
