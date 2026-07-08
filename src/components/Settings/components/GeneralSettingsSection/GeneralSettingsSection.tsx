import {type ChangeEvent, type FocusEvent} from 'react';
import clsx from 'clsx';
import {SlidersHorizontal} from 'lucide-react';
import {FieldValidationMessage, fieldValidationStyles} from '@/components';
import {Select} from '@/components/Select';
import {t} from '@/i18n';
import styles from '../../SettingsPanel.module.scss';
import {SettingsSectionHeader} from '../SettingsSectionHeader';
import {WeatherSettingsFields} from './components/WeatherSettingsFields/WeatherSettingsFields';
import {useGeneralSettingsController} from './hooks/useGeneralSettingsController';

interface GeneralSettingsSectionProps {
  dismissRequestId?: number;
}

export function GeneralSettingsSection({dismissRequestId = 0}: GeneralSettingsSectionProps) {
    const {
        handleLocaleChange,
        handleTabTitleBlur,
        handleTabTitleChange,
        handleTabTitleSave,
        locale,
        localeOptions,
        settings,
        tabTitle,
        tabTitleValidation,
    } = useGeneralSettingsController({dismissRequestId});

    const sectionClassName = clsx(styles.section, styles.sectionFirst);

    const tabTitleFieldLabelClassName = clsx(
        styles.fieldLabel,
        tabTitleValidation.isInvalid && fieldValidationStyles.fieldLabelInvalid,
    );
    const tabTitleInputClassName = clsx(
        styles.inlineRowInput,
        tabTitleValidation.isInvalid && fieldValidationStyles.fieldControlInvalid,
    );

    const handleSaveTabTitleClick = () => {
        void handleTabTitleSave();
    };

    const handleTabTitleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleTabTitleChange(event.target.value);
    };

    const handleTabTitleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
        handleTabTitleBlur(event.target.value);
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
                            onChange={handleTabTitleInputChange}
                            onBlur={handleTabTitleInputBlur}
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
            </div>

            <div className={styles.rowDivider} role="separator" aria-hidden />

            <WeatherSettingsFields dismissRequestId={dismissRequestId} />
        </section>
    );
}
