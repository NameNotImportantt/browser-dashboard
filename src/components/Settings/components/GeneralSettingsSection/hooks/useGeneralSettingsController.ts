import {useEffect, useMemo, useState} from 'react';
import {useFieldValidation} from '@/components';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';

interface UseGeneralSettingsControllerOptions {
    dismissRequestId: number;
}

export function useGeneralSettingsController({dismissRequestId}: UseGeneralSettingsControllerOptions) {
    const {settings, setLocale, setTabTitle: saveSettingsTabTitle} = useSettings();
    const locale = settings.locale;
    const [tabTitle, setTabTitle] = useState(settings.tabTitle);
    const tabTitleValidation = useFieldValidation();

    useEffect(() => {
        setTabTitle(settings.tabTitle);
        tabTitleValidation.reset();
    }, [settings.tabTitle]);

    useEffect(() => {
        tabTitleValidation.reset();
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

    return {
        handleLocaleChange,
        handleTabTitleBlur,
        handleTabTitleChange,
        handleTabTitleSave,
        locale,
        localeOptions,
        settings,
        tabTitle,
        tabTitleValidation,
    };
}
