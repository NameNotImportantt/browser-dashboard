import clsx from 'clsx';
import {FieldValidationMessage, fieldValidationStyles} from '@/components';
import {Checkbox} from '@/components/Checkbox';
import {Select} from '@/components/Select';
import {t} from '@/i18n';
import {SEARCH_URL_HINT} from '@/search';
import settingsStyles from '../../../../SettingsPanel.module.scss';
import styles from './AddSearchEngineControls.module.scss';
import {useAddSearchEngineControls} from './hooks/useAddSearchEngineControls';
import type {AppLocale, AppSettings} from '@/db';

export interface AddSearchEngineControlsProps {
  dismissRequestId?: number;
  locale: AppLocale;
  settings: AppSettings;
  onSelectActiveEngine: (engineId: string) => Promise<void>;
  onToggleOnlineSuggestionsEnabled: (enabled: boolean) => Promise<void>;
  onAddCustomEngine: (payload: { name: string; urlTemplate: string }) => Promise<void>;
  onRemoveCustomEngine: (engineId: string) => Promise<void>;
}

export function AddSearchEngineControls({
    dismissRequestId = 0,
    locale,
    settings,
    onSelectActiveEngine,
    onToggleOnlineSuggestionsEnabled,
    onAddCustomEngine,
    onRemoveCustomEngine,
}: AddSearchEngineControlsProps) {
    const {
        engineName,
        engineNameValidation,
        engineUrl,
        engineUrlValidation,
        handleAddEngine,
        handleEngineNameChange,
        handleEngineUrlChange,
        searchEngineSelectOptions,
        searchTemplateHintId,
    } = useAddSearchEngineControls({
        dismissRequestId,
        locale,
        settings,
        onAddCustomEngine,
    });

    const onlineSuggestionsFieldClassName = clsx(settingsStyles.field, styles.checkboxField);
    const engineNameInputClassName = clsx(styles.formInput, engineNameValidation.isInvalid && fieldValidationStyles.fieldControlInvalid);
    const engineUrlInputClassName = clsx(styles.formInput, engineUrlValidation.isInvalid && fieldValidationStyles.fieldControlInvalid);

    const searchTemplateHintClassName = clsx(
        settingsStyles.hint,
        engineUrlValidation.isInvalid && fieldValidationStyles.fieldHintInvalid,
    );

    const handleActiveEngineChange = (value: string) => {
        void onSelectActiveEngine(value);
    };

    const handleOnlineSuggestionsChange = () => {
        void onToggleOnlineSuggestionsEnabled(!settings.onlineSearchSuggestionsEnabled);
    };

    return (
        <>
            <div className={settingsStyles.field}>
                <span className={settingsStyles.fieldLabel}>{t(locale, 'currentSearchEngines')}</span>
                <Select
                    dismissRequestId={dismissRequestId}
                    value={settings.activeSearchEngineId}
                    options={searchEngineSelectOptions}
                    onChange={handleActiveEngineChange}
                    ariaLabel={t(locale, 'currentSearchEngines')}
                />
            </div>

            <form className={styles.customEngineForm} onSubmit={handleAddEngine}>
                <div className={styles.formField}>
                    <input
                        className={engineNameInputClassName}
                        value={engineName}
                        onChange={handleEngineNameChange}
                        placeholder={t(locale, 'searchEngineNamePlaceholder')}
                        aria-label={t(locale, 'searchEngineNamePlaceholder')}
                        {...engineNameValidation.getAriaProps()}
                    />

                    <FieldValidationMessage
                        className={styles.formMessage}
                        id={engineNameValidation.messageId}
                        message={engineNameValidation.showError ? engineNameValidation.validation.error : null}
                    />
                </div>

                <div className={styles.formField}>
                    <input
                        className={engineUrlInputClassName}
                        value={engineUrl}
                        onChange={handleEngineUrlChange}
                        placeholder={t(locale, 'searchEngineLinkPlaceholder')}
                        aria-label={t(locale, 'searchEngineLinkPlaceholder')}
                        {...engineUrlValidation.getAriaProps(searchTemplateHintId)}
                    />

                    <small className={searchTemplateHintClassName} id={searchTemplateHintId}>
                        {t(locale, 'customSearchFormat')} <code>{SEARCH_URL_HINT}</code>
                    </small>

                    <FieldValidationMessage
                        className={styles.formMessage}
                        id={engineUrlValidation.messageId}
                        message={engineUrlValidation.showError ? engineUrlValidation.validation.error : null}
                    />
                </div>

                <button type="submit" className="primary">
                    {t(locale, 'addSearchEngine')}
                </button>
            </form>

            <div className={onlineSuggestionsFieldClassName}>
                <Checkbox
                    checked={settings.onlineSearchSuggestionsEnabled}
                    onChange={handleOnlineSuggestionsChange}
                    label={t(locale, 'onlineSearchSuggestionsEnabled')}
                />
                <small className={settingsStyles.hint}>{t(locale, 'onlineSearchSuggestionsHint')}</small>
            </div>

            {settings.customSearchEngines.length > 0 ? (
                <ul className={styles.engineList}>
                    {settings.customSearchEngines.map(engine => {
                        const handleRemoveEngineClick = () => {
                            void onRemoveCustomEngine(engine.id);
                        };

                        return (
                            <li className={styles.engineItem} key={engine.id}>
                                <span className={styles.engineItemText}>
                                    {engine.name}: {engine.urlTemplate}
                                </span>
                                <button
                                    type="button"
                                    className={styles.dangerButton}
                                    onClick={handleRemoveEngineClick}
                                >
                                    {t(locale, 'remove')}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </>
    );
}
