import {useEffect, useId, useMemo, useState, type ChangeEvent, type FormEvent} from 'react';
import clsx from 'clsx';
import {FieldValidationMessage, fieldValidationStyles, useFieldValidation} from '@/components';
import {Checkbox} from '@/components/Checkbox';
import {Select} from '@/components/Select';
import {t} from '@/i18n';
import {getSearchEngineOptions, isValidSearchUrlTemplate, SEARCH_URL_HINT} from '@/search';
import settingsStyles from '../../../../SettingsPanel.module.scss';
import styles from './AddSearchEngineControls.module.scss';
import type {AppLocale, AppSettings} from '@/db';

export interface AddSearchEngineControlsProps {
  dismissRequestId?: number;
  locale: AppLocale;
  settings: AppSettings;
  onSelectActiveEngine: (engineId: string) => Promise<void>;
  onToggleSearchOpenInNewTab: (enabled: boolean) => Promise<void>;
  onToggleOnlineSuggestionsEnabled: (enabled: boolean) => Promise<void>;
  onAddCustomEngine: (payload: { name: string; urlTemplate: string }) => Promise<void>;
  onRemoveCustomEngine: (engineId: string) => Promise<void>;
}

export function AddSearchEngineControls({
    dismissRequestId = 0,
    locale,
    settings,
    onSelectActiveEngine,
    onToggleSearchOpenInNewTab,
    onToggleOnlineSuggestionsEnabled,
    onAddCustomEngine,
    onRemoveCustomEngine,
}: AddSearchEngineControlsProps) {
    const [engineName, setEngineName] = useState('');
    const [engineUrl, setEngineUrl] = useState('');
    const engineNameValidation = useFieldValidation();
    const engineUrlValidation = useFieldValidation();
    const searchOptions = getSearchEngineOptions(settings.customSearchEngines);
    const searchTemplateHintId = useId();
    const onlineSuggestionsFieldClassName = clsx(settingsStyles.field, styles.checkboxField);
    const engineNameInputClassName = clsx(styles.formInput, engineNameValidation.isInvalid && fieldValidationStyles.fieldControlInvalid);
    const engineUrlInputClassName = clsx(styles.formInput, engineUrlValidation.isInvalid && fieldValidationStyles.fieldControlInvalid);

    const searchTemplateHintClassName = clsx(
        settingsStyles.hint,
        engineUrlValidation.isInvalid && fieldValidationStyles.fieldHintInvalid,
    );

    const searchEngineSelectOptions = useMemo(
        () => searchOptions.map(option => ({value: option.id, label: option.name})),
        [searchOptions],
    );

    const resetCustomEngineForm = () => {
        setEngineName('');
        setEngineUrl('');
        engineNameValidation.reset();
        engineUrlValidation.reset();
    };

    useEffect(() => {
        resetCustomEngineForm();
    }, [dismissRequestId]);

    const handleActiveEngineChange = (value: string) => {
        void onSelectActiveEngine(value);
    };

    const handleOnlineSuggestionsChange = () => {
        void onToggleOnlineSuggestionsEnabled(!settings.onlineSearchSuggestionsEnabled);
    };

    const handleSearchOpenInNewTabChange = () => {
        void onToggleSearchOpenInNewTab(!settings.searchOpenInNewTab);
    };

    const handleEngineNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEngineName(event.target.value);
        engineNameValidation.clearError();
    };

    const handleEngineUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEngineUrl(event.target.value);
        engineUrlValidation.clearError();
    };

    const addEngine = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedEngineName = engineName.trim();
        const trimmedEngineUrl = engineUrl.trim();
        let hasError = false;

        if (!trimmedEngineName) {
            engineNameValidation.markSubmitted();
            engineNameValidation.setError(t(locale, 'searchEngineNameRequired'));
            hasError = true;
        } else {
            engineNameValidation.clearError();
        }

        if (!trimmedEngineUrl) {
            engineUrlValidation.markSubmitted();
            engineUrlValidation.setError(t(locale, 'searchEngineUrlTemplateRequired'));
            hasError = true;
        } else if (!isValidSearchUrlTemplate(trimmedEngineUrl)) {
            engineUrlValidation.markSubmitted();
            engineUrlValidation.setError(t(locale, 'customSearchTemplateInvalid'));
            hasError = true;
        } else {
            engineUrlValidation.clearError();
        }

        if (hasError) {
            return;
        }

        await onAddCustomEngine({name: trimmedEngineName, urlTemplate: trimmedEngineUrl});
        resetCustomEngineForm();
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

            <form className={styles.customEngineForm} onSubmit={addEngine}>
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
                    checked={settings.searchOpenInNewTab}
                    onChange={handleSearchOpenInNewTabChange}
                    label={t(locale, 'searchOpenInNewTab')}
                />
                <small className={settingsStyles.hint}>{t(locale, 'searchOpenInNewTabHint')}</small>
            </div>

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
