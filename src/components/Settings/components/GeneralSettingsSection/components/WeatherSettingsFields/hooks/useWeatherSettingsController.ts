import {useEffect, useId, useMemo, useState} from 'react';
import {useFieldValidation} from '@/components';
import {useSettings, useWeather} from '@/dashboard';
import {WeatherProvider} from '@/db';
import {useActionStatus} from '@/hooks/useActionStatus';
import {t} from '@/i18n';

interface UseWeatherSettingsControllerOptions {
    dismissRequestId: number;
}

export function useWeatherSettingsController({dismissRequestId}: UseWeatherSettingsControllerOptions) {
    const {
        settings,
        setWeatherProvider: saveWeatherProvider,
        setWeatherApiKey: saveWeatherApiKey,
    } = useSettings();

    const {setWeatherCity: saveWeatherCity} = useWeather();
    const locale = settings.locale;
    const [weatherProvider, setWeatherProvider] = useState(settings.weatherProvider);
    const [weatherApiKey, setWeatherApiKey] = useState(settings.weatherApiKey ?? '');
    const [isWeatherApiKeyVisible, setIsWeatherApiKeyVisible] = useState(false);
    const [weatherCity, setWeatherCity] = useState(settings.weatherLocation?.label ?? '');
    const weatherStatus = useActionStatus();
    const weatherApiKeyValidation = useFieldValidation();
    const weatherCityValidation = useFieldValidation();
    const weatherLocationHintId = useId();

    useEffect(() => {
        setWeatherCity(settings.weatherLocation?.label ?? '');
        weatherCityValidation.reset();
    }, [settings.weatherLocation?.label]);

    useEffect(() => {
        setWeatherProvider(settings.weatherProvider);
        weatherApiKeyValidation.reset();
    }, [settings.weatherProvider]);

    useEffect(() => {
        setWeatherApiKey(settings.weatherApiKey ?? '');
        weatherApiKeyValidation.reset();
    }, [settings.weatherApiKey]);

    useEffect(() => {
        weatherStatus.reset();
        weatherApiKeyValidation.reset();
        weatherCityValidation.reset();
    }, [dismissRequestId]);

    const weatherProviderOptions = useMemo(
        () => [
            {value: WeatherProvider.OpenMeteo, label: t(locale, 'weatherProviderOpenMeteo')},
            {value: WeatherProvider.WeatherApi, label: t(locale, 'weatherProviderWeatherApi')},
        ],
        [locale],
    );

    const validateWeatherApiKey = (nextWeatherApiKey: string, nextWeatherProvider: WeatherProvider) => {
        if (nextWeatherProvider !== WeatherProvider.WeatherApi) {
            return null;
        }

        return nextWeatherApiKey.trim() ? null : t(locale, 'weatherApiKeyRequired');
    };

    const validateWeatherCity = (nextWeatherCity: string) => {
        return nextWeatherCity.trim() ? null : t(locale, 'weatherCityRequired');
    };

    const saveWeatherApiKeyIfNeeded = async (nextWeatherApiKey: string) => {
        if (weatherProvider !== WeatherProvider.WeatherApi) {
            return;
        }

        const trimmedWeatherApiKey = nextWeatherApiKey.trim();
        const savedWeatherApiKey = settings.weatherApiKey?.trim() ?? '';

        if (trimmedWeatherApiKey === savedWeatherApiKey) {
            return;
        }

        await saveWeatherApiKey(trimmedWeatherApiKey || null);
    };

    const handleWeatherProviderChange = (value: string) => {
        const nextWeatherProvider = value as WeatherProvider;

        setWeatherProvider(nextWeatherProvider);
        weatherStatus.reset();

        if (nextWeatherProvider !== WeatherProvider.WeatherApi) {
            weatherApiKeyValidation.reset();
            setIsWeatherApiKeyVisible(false);
        }

        void saveWeatherProvider(nextWeatherProvider);
    };

    const handleWeatherApiKeyChange = (nextWeatherApiKey: string) => {
        setWeatherApiKey(nextWeatherApiKey);
        weatherStatus.reset();

        if (validateWeatherApiKey(nextWeatherApiKey, weatherProvider) === null) {
            weatherApiKeyValidation.clearError();
        }
    };

    const handleWeatherApiKeyBlur = async (nextWeatherApiKey: string) => {
        weatherApiKeyValidation.markTouched();

        const error = validateWeatherApiKey(nextWeatherApiKey, weatherProvider);

        if (error) {
            weatherApiKeyValidation.setError(error);
            return;
        }

        weatherApiKeyValidation.clearError();

        try {
            await saveWeatherApiKeyIfNeeded(nextWeatherApiKey);
        } catch {
            weatherStatus.fail(t(locale, 'weatherLookupFailed'));
        }
    };

    const toggleWeatherApiKeyVisibility = () => {
        setIsWeatherApiKeyVisible(currentIsWeatherApiKeyVisible => !currentIsWeatherApiKeyVisible);
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
        const weatherApiKeyError = validateWeatherApiKey(weatherApiKey, weatherProvider);
        const error = validateWeatherCity(nextCity);

        if (weatherApiKeyError) {
            weatherApiKeyValidation.markTouched();
            weatherApiKeyValidation.setError(weatherApiKeyError);
        }

        if (error) {
            weatherCityValidation.markTouched();
            weatherCityValidation.setError(error);
        }

        if (weatherApiKeyError || error) {
            return;
        }

        weatherApiKeyValidation.clearError();
        weatherCityValidation.clearError();
        weatherStatus.start();

        try {
            await saveWeatherApiKeyIfNeeded(weatherApiKey);
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
        handleWeatherApiKeyBlur,
        handleWeatherApiKeyChange,
        handleWeatherCityBlur,
        handleWeatherCityChange,
        handleWeatherProviderChange,
        isWeatherApiKeyVisible,
        locale,
        lookupWeatherCity,
        settings,
        toggleWeatherApiKeyVisibility,
        weatherApiKey,
        weatherApiKeyValidation,
        weatherCity,
        weatherCityValidation,
        weatherInputAriaProps,
        weatherLocationHintId,
        weatherProvider,
        weatherProviderOptions,
        weatherStatus,
    };
}
