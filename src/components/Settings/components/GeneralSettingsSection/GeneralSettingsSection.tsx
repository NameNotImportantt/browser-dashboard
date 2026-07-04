import {useEffect, useId, useMemo, useState, type ChangeEvent, type FocusEvent} from 'react';
import clsx from 'clsx';
import {SlidersHorizontal} from 'lucide-react';
import {ActionStatus, FieldValidationMessage, fieldValidationStyles, useFieldValidation} from '@/components';
import {Select} from '@/components/Select';
import {useSettings, useWeather} from '@/dashboard';
import {useActionStatus} from '@/hooks/useActionStatus';
import {t} from '@/i18n';
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
    const tabTitleValidation = useFieldValidation();
    const weatherCityValidation = useFieldValidation();
    const weatherLocationHintId = useId();
    const sectionClassName = clsx(styles.section, styles.sectionFirst);

    const tabTitleFieldLabelClassName = clsx(
        styles.fieldLabel,
        tabTitleValidation.isInvalid && fieldValidationStyles.fieldLabelInvalid,
    );
    const weatherFieldLabelClassName = clsx(
        styles.fieldLabel,
        weatherCityValidation.isInvalid && fieldValidationStyles.fieldLabelInvalid,
    );
    const tabTitleInputClassName = clsx(
        styles.inlineRowInput,
        tabTitleValidation.isInvalid && fieldValidationStyles.fieldControlInvalid,
    );
    const weatherInputClassName = clsx(
        styles.inlineRowInput,
        weatherCityValidation.isInvalid && fieldValidationStyles.fieldControlInvalid,
    );
    const weatherLocationHintClassName = clsx(
        styles.hint,
        weatherCityValidation.isInvalid && fieldValidationStyles.fieldHintInvalid,
    );

    useEffect(() => {
        setTabTitle(settings.tabTitle);
        setWeatherCity(settings.weatherLocation?.label ?? '');
        tabTitleValidation.reset();
        weatherCityValidation.reset();
    }, [settings.tabTitle, settings.weatherLocation?.label]);

    useEffect(() => {
        weatherStatus.reset();
        tabTitleValidation.reset();
        weatherCityValidation.reset();
    }, [dismissRequestId]);

    const localeOptions = useMemo(
        () => [
            {value: 'ru', label: 'Русский'},
            {value: 'en', label: 'English'},
        ],
        [],
    );

    const validateTabTitle = (nextTabTitle: string) => {
        return nextTabTitle.trim() ? null : t(locale, 'tabTitleRequired');
    };

    const validateWeatherCity = (nextWeatherCity: string) => {
        return nextWeatherCity.trim() ? null : t(locale, 'weatherCityRequired');
    };

    const handleLocaleChange = (value: string) => {
        void setLocale(value as typeof settings.locale);
    };

    const handleTabTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextTabTitle = event.target.value;

        setTabTitle(nextTabTitle);

        if (validateTabTitle(nextTabTitle) === null) {
            tabTitleValidation.clearError();
        }
    };

    const handleTabTitleBlur = (event: FocusEvent<HTMLInputElement>) => {
        tabTitleValidation.markTouched();

        const error = validateTabTitle(event.target.value);

        if (error) {
            tabTitleValidation.setError(error);
            return;
        }

        tabTitleValidation.clearError();
    };

    const saveTabTitle = async () => {
        const error = validateTabTitle(tabTitle);

        if (error) {
            tabTitleValidation.markTouched();
            tabTitleValidation.setError(error);
            return;
        }

        tabTitleValidation.clearError();
        await saveSettingsTabTitle(tabTitle.trim());
    };

    const handleSaveTabTitleClick = () => {
        void saveTabTitle();
    };

    const handleWeatherCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextWeatherCity = event.target.value;

        setWeatherCity(nextWeatherCity);
        weatherStatus.reset();

        if (validateWeatherCity(nextWeatherCity) === null) {
            weatherCityValidation.clearError();
        }
    };

    const handleWeatherCityBlur = (event: FocusEvent<HTMLInputElement>) => {
        weatherCityValidation.markTouched();

        const error = validateWeatherCity(event.target.value);

        if (error) {
            weatherCityValidation.setError(error);
            return;
        }

        weatherCityValidation.clearError();
    };

    const lookupWeatherCity = async () => {
        const nextCity = weatherCity.trim();
        const error = validateWeatherCity(nextCity);

        if (error) {
            weatherCityValidation.markTouched();
            weatherCityValidation.setError(error);
            return;
        }

        weatherCityValidation.clearError();
        weatherStatus.start();

        try {
            await saveWeatherCity(nextCity);
            weatherStatus.succeed(t(locale, 'weatherLookupSuccess'));
        } catch {
            weatherStatus.fail(t(locale, 'weatherLookupFailed'));
        }
    };

    const clearWeatherCity = async () => {
        weatherCityValidation.reset();
        weatherStatus.start();

        try {
            await saveWeatherCity('');
            setWeatherCity('');
            weatherStatus.succeed(t(locale, 'weatherLookupCleared'));
        } catch {
            weatherStatus.fail(t(locale, 'weatherLookupFailed'));
        }
    };

    const handleLookupWeatherCityClick = () => {
        void lookupWeatherCity();
    };

    const handleClearWeatherCityClick = () => {
        void clearWeatherCity();
    };

    const weatherInputAriaProps = settings.weatherLocation
        ? weatherCityValidation.getAriaProps(weatherLocationHintId)
        : weatherCityValidation.getAriaProps();

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
                        onChange={handleLocaleChange}
                        ariaLabel={t(locale, 'locale')}
                    />
                </div>

                <label className={styles.field}>
                    <span className={tabTitleFieldLabelClassName}>{t(locale, 'tabTitle')}</span>
                    <div className={styles.inlineRow}>
                        <input
                            className={tabTitleInputClassName}
                            value={tabTitle}
                            onChange={handleTabTitleChange}
                            onBlur={handleTabTitleBlur}
                            aria-label={t(locale, 'tabTitle')}
                            {...tabTitleValidation.getAriaProps()}
                        />
                        <button type="button" onClick={handleSaveTabTitleClick}>
                            {t(locale, 'save')}
                        </button>
                    </div>

                    <FieldValidationMessage
                        className={styles.error}
                        id={tabTitleValidation.messageId}
                        message={tabTitleValidation.showError ? tabTitleValidation.validation.error : null}
                    />
                </label>

                <div className={styles.field}>
                    <span className={weatherFieldLabelClassName}>{t(locale, 'weatherCity')}</span>
                    <div className={styles.inlineRow}>
                        <input
                            className={weatherInputClassName}
                            value={weatherCity}
                            onChange={handleWeatherCityChange}
                            onBlur={handleWeatherCityBlur}
                            placeholder={t(locale, 'weatherCityPlaceholder')}
                            aria-label={t(locale, 'weatherCity')}
                            {...weatherInputAriaProps}
                        />
                        <button type="button" onClick={handleLookupWeatherCityClick} disabled={weatherStatus.isPending}>
                            {t(locale, 'lookupCity')}
                        </button>
                        {settings.weatherLocation ? (
                            <button
                                type="button"
                                className={styles.dangerButton}
                                onClick={handleClearWeatherCityClick}
                                disabled={weatherStatus.isPending}
                            >
                                {t(locale, 'remove')}
                            </button>
                        ) : null}
                    </div>
                    {settings.weatherLocation ? (
                        <small className={weatherLocationHintClassName} id={weatherLocationHintId}>
                            {settings.weatherLocation.label}
                        </small>
                    ) : null}

                    <FieldValidationMessage
                        className={styles.error}
                        id={weatherCityValidation.messageId}
                        message={weatherCityValidation.showError ? weatherCityValidation.validation.error : null}
                    />

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
