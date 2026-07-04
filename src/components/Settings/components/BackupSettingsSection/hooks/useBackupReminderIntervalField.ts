import {useEffect, useState, type ChangeEvent} from 'react';
import {t} from '@/i18n';
import type {AppLocale} from '@/db';

interface UseBackupReminderIntervalFieldOptions {
    locale: AppLocale;
    value: number;
    onCommit: (value: number) => Promise<void>;
}

const INTERVAL_DAYS_ERROR_ID = 'backup-reminder-interval-days-error';
const INTERVAL_DAYS_HINT_ID = 'backup-reminder-interval-days-hint';

export function useBackupReminderIntervalField({
    locale,
    value,
    onCommit,
}: UseBackupReminderIntervalFieldOptions) {
    const [draft, setDraft] = useState(() => String(value));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setDraft(String(value));
        setError(null);
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

        if (error) {
            setError(validateDraft(nextValue));
        }
    };

    const handleBlur = () => {
        void (async () => {
            const nextError = validateDraft(draft);

            setError(nextError);

            if (nextError) {
                return;
            }

            const normalizedValue = Math.round(Number(draft));

            setDraft(String(normalizedValue));
            setError(null);
            await onCommit(normalizedValue);
        })();
    };

    return {
        draft,
        error,
        errorId: INTERVAL_DAYS_ERROR_ID,
        handleBlur,
        handleChange,
        hintId: INTERVAL_DAYS_HINT_ID,
    };
}
