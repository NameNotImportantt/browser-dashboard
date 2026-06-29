import {useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import {SlidersHorizontal} from 'lucide-react';
import {t} from '@/app';
import {ActionStatus} from '@/components';
import {Select} from '@/components/Select';
import {useSettings, useWeather} from '@/dashboard';
import {useActionStatus} from '@/hooks/useActionStatus';
import styles from '../../SettingsPanel.module.scss';
import {SettingsSectionHeader} from '../SettingsSectionHeader';

interface GeneralSettingsSectionProps {
  dismissRequestId?: number;
}

export function GeneralSettingsSection({dismissRequestId = 0}: GeneralSettingsSectionProps) {
    const {settings, setLocale, setTabTitle: saveSettingsTabTitle} = useSettings();
    const {setWeatherCity: saveWeatherCity} = useWeather();
    const locale = settings.locale;
    const [tabTitle, setTabTitle] = useState(settings.tabTitle);
    const [weatherCity, setWeatherCity] = useState(settings.weatherLocation?.label ?? '');
    const weatherStatus = useActionStatus();
    const sectionClassName = clsx(styles.section, styles.sectionFirst);

    useEffect(() => {
        setTabTitle(settings.tabTitle);
        setWeatherCity(settings.weatherLocation?.label ?? '');
    }, [settings.tabTitle, settings.weatherLocation?.label]);

    useEffect(() => {
        weatherStatus.reset();
    }, [dismissRequestId]);

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
        const nextCity = weatherCity.trim();

        if (!nextCity) {
            weatherStatus.fail(t(locale, 'weatherCityRequired'));
            return;
        }

        weatherStatus.start();

        try {
            await saveWeatherCity(nextCity);
            weatherStatus.succeed(t(locale, 'weatherLookupSuccess'));
        } catch {
            weatherStatus.fail(t(locale, 'weatherLookupFailed'));
        }
    };

    const clearWeatherCity = async () => {
        weatherStatus.start();

        try {
            await saveWeatherCity('');
            setWeatherCity('');
            weatherStatus.succeed(t(locale, 'weatherLookupCleared'));
        } catch {
            weatherStatus.fail(t(locale, 'weatherLookupFailed'));
        }
    };

    return (
        <section className={sectionClassName}>
            <SettingsSectionHeader title={t(locale, 'settingsGeneral')} icon={SlidersHorizontal} />
            <div className={styles.grid}>
                <div className={styles.field}>
                    <span className={styles.fieldLabel}>{t(locale, 'locale')}</span>
                    <Select
                        dismissRequestId={dismissRequestId}
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
                            onChange={event => {
                                setWeatherCity(event.target.value);
                                weatherStatus.reset();
                            }}
                            placeholder={t(locale, 'weatherCityPlaceholder')}
                        />
                        <button type="button" onClick={() => void lookupWeatherCity()} disabled={weatherStatus.isPending}>
                            {t(locale, 'lookupCity')}
                        </button>
                        {settings.weatherLocation ? (
                            <button
                                type="button"
                                className={styles.dangerButton}
                                onClick={() => void clearWeatherCity()}
                                disabled={weatherStatus.isPending}
                            >
                                {t(locale, 'remove')}
                            </button>
                        ) : null}
                    </div>
                    {settings.weatherLocation ? <small className={styles.hint}>{settings.weatherLocation.label}</small> : null}
                    <ActionStatus
                        status={weatherStatus.status}
                        message={weatherStatus.message}
                        pendingLabel={t(locale, 'weatherLookupPending')}
                    />
                </div>
            </div>
        </section>
    );
}
