import {useEffect, useState} from 'react';
import {t} from '@/i18n';
import {isValidSearchUrlTemplate} from '@/search';
import type {AppLocale} from '@/db';

interface AddCustomEnginePayload {
    name: string;
    urlTemplate: string;
}

interface UseCustomSearchEngineFormOptions {
    dismissRequestId: number;
    locale: AppLocale;
    onAddCustomEngine: (payload: AddCustomEnginePayload) => Promise<void>;
}

export function useCustomSearchEngineForm({
    dismissRequestId,
    locale,
    onAddCustomEngine,
}: UseCustomSearchEngineFormOptions) {
    const [engineName, setEngineName] = useState('');
    const [engineUrl, setEngineUrl] = useState('');
    const [engineError, setEngineError] = useState<string | null>(null);

    useEffect(() => {
        setEngineError(null);
        setEngineName('');
        setEngineUrl('');
    }, [dismissRequestId]);

    const handleEngineNameChange = (nextValue: string) => {
        setEngineName(nextValue);
        setEngineError(null);
    };

    const handleEngineUrlChange = (nextValue: string) => {
        setEngineUrl(nextValue);
        setEngineError(null);
    };

    const addEngine = async () => {
        if (!engineName.trim()) {
            setEngineError(t(locale, 'searchEngineNameRequired'));
            return;
        }

        if (!isValidSearchUrlTemplate(engineUrl.trim())) {
            setEngineError(t(locale, 'customSearchTemplateInvalid'));
            return;
        }

        await onAddCustomEngine({name: engineName, urlTemplate: engineUrl});
        setEngineName('');
        setEngineUrl('');
        setEngineError(null);
    };

    return {
        addEngine,
        engineError,
        engineName,
        engineUrl,
        handleEngineNameChange,
        handleEngineUrlChange,
    };
}
