import {useEffect, useId, useMemo, useState} from 'react';
import {useFieldValidation} from '@/components';
import {useSettings, useWeather} from '@/dashboard';
import {useActionStatus} from '@/hooks/useActionStatus';
import {t} from '@/i18n';

interface UseGeneralSettingsControllerOptions {
    dismissRequestId: number;
}

export function useGeneralSettingsController({dismissRequestId}: UseGeneralSettingsControllerOptions) {
    const {settings, setLocale, setTabTitle: saveSettingsTabTitle} = useSettings();
    const {setWeatherCity: saveWeatherCity} = useWeather();
    const locale = settings.locale;
    const [tabTitle, setTabTitle] = useState(settings.tabTitle);
    const [weatherCity, setWeatherCity] = useState(settings.weatherLocation?.label ?? '');
    const weatherStatus = useActionStatus();
    const tabTitleValidation = useFieldValidation();
    const weatherCityValidation = useFieldValidation();
    const weatherLocationHintId = useId();

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

    const handleTabTitleChange = (nextTabTitle: string) => {
        setTabTitle(nextTabTitle);

        if (validateTabTitle(nextTabTitle) === null) {
            tabTitleValidation.clearError();
        }
    };

    const handleTabTitleBlur = (nextTabTitle: string) => {
        tabTitleValidation.markTouched();

        const error = validateTabTitle(nextTabTitle);

        if (error) {
            tabTitleValidation.setError(error);
            return;
        }

        tabTitleValidation.clearError();
    };

    const handleTabTitleSave = async () => {
        const error = validateTabTitle(tabTitle);

        if (error) {
            tabTitleValidation.markTouched();
            tabTitleValidation.setError(error);
            return;
        }

        tabTitleValidation.clearError();
        await saveSettingsTabTitle(tabTitle.trim());
    };

    const handleWeatherCityChange = (nextWeatherCity: string) => {
        setWeatherCity(nextWeatherCity);
        weatherStatus.reset();

        if (validateWeatherCity(nextWeatherCity) === null) {
            weatherCityValidation.clearError();
        }
    };

    const handleWeatherCityBlur = (nextWeatherCity: string) => {
        weatherCityValidation.markTouched();

        const error = validateWeatherCity(nextWeatherCity);

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

    const weatherInputAriaProps = settings.weatherLocation
        ? weatherCityValidation.getAriaProps(weatherLocationHintId)
        : weatherCityValidation.getAriaProps();

    return {
        clearWeatherCity,
        handleLocaleChange,
        handleTabTitleBlur,
        handleTabTitleChange,
        handleTabTitleSave,
        handleWeatherCityBlur,
        handleWeatherCityChange,
        locale,
        localeOptions,
        lookupWeatherCity,
        settings,
        tabTitle,
        tabTitleValidation,
        weatherCity,
        weatherCityValidation,
        weatherInputAriaProps,
        weatherLocationHintId,
        weatherStatus,
    };
}
