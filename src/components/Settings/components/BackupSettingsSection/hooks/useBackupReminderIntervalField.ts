import {useEffect, useState, type ChangeEvent} from 'react';
import {useFieldValidation} from '@/components';
import {t} from '@/i18n';
import type {AppLocale} from '@/db';

interface UseBackupReminderIntervalFieldOptions {
    locale: AppLocale;
    value: number;
    onCommit: (value: number) => Promise<void>;
}

export function useBackupReminderIntervalField({
    locale,
    value,
    onCommit,
}: UseBackupReminderIntervalFieldOptions) {
    const [draft, setDraft] = useState(() => String(value));
    const validation = useFieldValidation();

    useEffect(() => {
        setDraft(String(value));
        validation.reset();
    }, [value]);

    const validateDraft = (nextValue: string) => {
        const parsedValue = Number(nextValue.trim());

        if (!Number.isFinite(parsedValue)) {
            return t(locale, 'backupReminderIntervalInvalid');
        }

        const normalizedValue = Math.round(parsedValue);

        if (normalizedValue < 1 || normalizedValue > 365) {
            return t(locale, 'backupReminderIntervalOutOfRange');
        }

        return null;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;

        setDraft(nextValue);

        if (validation.validation.error) {
            validation.setError(validateDraft(nextValue));
        }
    };

    const handleBlur = () => {
        void (async () => {
            validation.markTouched();
            const nextError = validateDraft(draft);

            validation.setError(nextError);

            if (nextError) {
                return;
            }

            const normalizedValue = Math.round(Number(draft.trim()));

            setDraft(String(normalizedValue));
            await onCommit(normalizedValue);
        })();
    };

    return {
        draft,
        handleBlur,
        handleChange,
        inputAriaProps: validation.getAriaProps(),
        validation,
    };
}
