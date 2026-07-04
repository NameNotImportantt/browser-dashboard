import {useEffect, useId, useState, type ChangeEvent} from 'react';
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
    const hintId = useId();
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

        if (validation.validation.error !== null) {
            const nextError = validateDraft(nextValue);

            if (nextError) {
                validation.setError(nextError);
                return;
            }

            validation.clearError();
        }
    };

    const handleBlur = () => {
        void (async () => {
            validation.markTouched();
            const nextError = validateDraft(draft);

            if (nextError) {
                validation.setError(nextError);
                return;
            }

            const normalizedValue = Math.round(Number(draft));

            setDraft(String(normalizedValue));
            validation.clearError();
            await onCommit(normalizedValue);
        })();
    };

    return {
        draft,
        handleBlur,
        handleChange,
        hintId,
        inputAriaProps: validation.getAriaProps(hintId),
        isInvalid: validation.isInvalid,
        message: validation.showError ? validation.validation.error : null,
        messageId: validation.messageId,
    };
}
