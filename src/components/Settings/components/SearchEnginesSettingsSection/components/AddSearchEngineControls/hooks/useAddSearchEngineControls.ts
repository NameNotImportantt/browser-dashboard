import {useEffect, useId, useMemo, useState, type ChangeEvent, type FormEvent} from 'react';
import {useFieldValidation} from '@/components';
import {t} from '@/i18n';
import {getSearchEngineOptions, isValidSearchUrlTemplate} from '@/search';
import type {AppLocale, AppSettings} from '@/db';

interface UseAddSearchEngineControlsOptions {
    dismissRequestId: number;
    locale: AppLocale;
    settings: AppSettings;
    onAddCustomEngine: (payload: { name: string; urlTemplate: string }) => Promise<void>;
}

export function useAddSearchEngineControls({
    dismissRequestId,
    locale,
    settings,
    onAddCustomEngine,
}: UseAddSearchEngineControlsOptions) {
    const [engineName, setEngineName] = useState('');
    const [engineUrl, setEngineUrl] = useState('');
    const engineNameValidation = useFieldValidation();
    const engineUrlValidation = useFieldValidation();
    const searchTemplateHintId = useId();

    const searchEngineSelectOptions = useMemo(
        () => getSearchEngineOptions(settings.customSearchEngines).map(option => ({
            value: option.id,
            label: option.name,
        })),
        [settings.customSearchEngines],
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

    const handleEngineNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEngineName(event.target.value);
        engineNameValidation.clearError();
    };

    const handleEngineUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEngineUrl(event.target.value);
        engineUrlValidation.clearError();
    };

    const handleAddEngine = async (event: FormEvent<HTMLFormElement>) => {
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

    return {
        engineName,
        engineNameValidation,
        engineUrl,
        engineUrlValidation,
        handleAddEngine,
        handleEngineNameChange,
        handleEngineUrlChange,
        searchEngineSelectOptions,
        searchTemplateHintId,
    };
}
