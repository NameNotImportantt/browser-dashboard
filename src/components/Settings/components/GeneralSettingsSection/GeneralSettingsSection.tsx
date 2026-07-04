import clsx from 'clsx';
import {SlidersHorizontal} from 'lucide-react';
import {ActionStatus, FieldValidationMessage, fieldValidationStyles} from '@/components';
import {Select} from '@/components/Select';
import {t} from '@/i18n';
import styles from '../../SettingsPanel.module.scss';
import {SettingsSectionHeader} from '../SettingsSectionHeader';
import {useGeneralSettingsController} from './hooks/useGeneralSettingsController';

interface GeneralSettingsSectionProps {
  dismissRequestId?: number;
}

export function GeneralSettingsSection({dismissRequestId = 0}: GeneralSettingsSectionProps) {
    const {
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
    } = useGeneralSettingsController({dismissRequestId});

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

    const handleSaveTabTitleClick = () => {
        void handleTabTitleSave();
    };

    const handleLookupWeatherCityClick = () => {
        void lookupWeatherCity();
    };

    const handleClearWeatherCityClick = () => {
        void clearWeatherCity();
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
                            onChange={event => handleTabTitleChange(event.target.value)}
                            onBlur={event => handleTabTitleBlur(event.target.value)}
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
                            onChange={event => handleWeatherCityChange(event.target.value)}
                            onBlur={event => handleWeatherCityBlur(event.target.value)}
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
