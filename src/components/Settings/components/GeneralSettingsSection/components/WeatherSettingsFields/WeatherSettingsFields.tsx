import {type ChangeEvent, type FocusEvent} from 'react';
import clsx from 'clsx';
import {ActionStatus, FieldValidationMessage, fieldValidationStyles} from '@/components';
import {Select} from '@/components/Select';
import {WeatherProvider} from '@/db';
import {t} from '@/i18n';
import panelStyles from '../../../../SettingsPanel.module.scss';
import {useWeatherSettingsController} from './hooks/useWeatherSettingsController';
import styles from './WeatherSettingsFields.module.scss';

interface WeatherSettingsFieldsProps {
    dismissRequestId: number;
}

export function WeatherSettingsFields({dismissRequestId}: WeatherSettingsFieldsProps) {
    const {
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
    } = useWeatherSettingsController({dismissRequestId});

    const weatherFieldLabelClassName = clsx(
        panelStyles.fieldLabel,
        weatherCityValidation.isInvalid && fieldValidationStyles.fieldLabelInvalid,
    );
    const weatherApiKeyFieldLabelClassName = clsx(
        panelStyles.fieldLabel,
        weatherApiKeyValidation.isInvalid && fieldValidationStyles.fieldLabelInvalid,
    );
    const weatherApiKeyInputClassName = clsx(
        panelStyles.inlineRowInput,
        weatherApiKeyValidation.isInvalid && fieldValidationStyles.fieldControlInvalid,
    );
    const weatherInputClassName = clsx(
        panelStyles.inlineRowInput,
        weatherCityValidation.isInvalid && fieldValidationStyles.fieldControlInvalid,
    );
    const weatherLocationHintClassName = clsx(
        panelStyles.hint,
        weatherCityValidation.isInvalid && fieldValidationStyles.fieldHintInvalid,
    );

    const handleLookupWeatherCityClick = () => {
        void lookupWeatherCity();
    };

    const handleClearWeatherCityClick = () => {
        void clearWeatherCity();
    };

    const handleWeatherCityInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleWeatherCityChange(event.target.value);
    };

    const handleWeatherCityInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        handleWeatherCityBlur(event.target.value);
    };

    const handleWeatherApiKeyInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleWeatherApiKeyChange(event.target.value);
    };

    const handleWeatherApiKeyInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        void handleWeatherApiKeyBlur(event.target.value);
    };

    const handleToggleWeatherApiKeyVisibilityClick = () => {
        toggleWeatherApiKeyVisibility();
    };

    return (
        <div className={panelStyles.grid}>
            <h5 className={styles.minorTitle}>{t(locale, 'weatherSettingsTitle')}</h5>

            <div className={panelStyles.field}>
                <span className={panelStyles.fieldLabel}>{t(locale, 'weatherProvider')}</span>
                <Select
                    dismissRequestId={dismissRequestId}
                    value={weatherProvider}
                    options={weatherProviderOptions}
                    onChange={handleWeatherProviderChange}
                    ariaLabel={t(locale, 'weatherProvider')}
                />
            </div>

            {weatherProvider === WeatherProvider.WeatherApi ? (
                <label className={panelStyles.field}>
                    <span className={weatherApiKeyFieldLabelClassName}>{t(locale, 'weatherApiKey')}</span>
                    <div className={panelStyles.inlineRow}>
                        <input
                            className={weatherApiKeyInputClassName}
                            type={isWeatherApiKeyVisible ? 'text' : 'password'}
                            value={weatherApiKey}
                            onChange={handleWeatherApiKeyInputChange}
                            onBlur={handleWeatherApiKeyInputBlur}
                            placeholder={t(locale, 'weatherApiKeyPlaceholder')}
                            autoComplete="new-password"
                            aria-label={t(locale, 'weatherApiKey')}
                            {...weatherApiKeyValidation.getAriaProps()}
                        />
                        <button type="button" onClick={handleToggleWeatherApiKeyVisibilityClick}>
                            {isWeatherApiKeyVisible ? t(locale, 'hide') : t(locale, 'show')}
                        </button>
                    </div>

                    <FieldValidationMessage
                        className={panelStyles.error}
                        id={weatherApiKeyValidation.messageId}
                        message={weatherApiKeyValidation.showError ? weatherApiKeyValidation.validation.error : null}
                    />
                </label>
            ) : null}

            <div className={panelStyles.field}>
                <span className={weatherFieldLabelClassName}>{t(locale, 'weatherCity')}</span>
                <div className={panelStyles.inlineRow}>
                    <input
                        className={weatherInputClassName}
                        value={weatherCity}
                        onChange={handleWeatherCityInputChange}
                        onBlur={handleWeatherCityInputBlur}
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
                            className={panelStyles.dangerButton}
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
                    className={panelStyles.error}
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
    );
}
