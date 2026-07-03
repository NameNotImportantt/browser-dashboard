import type {FormEvent,ChangeEvent} from 'react';
import clsx from 'clsx';
import {t} from '@/i18n';
import styles from './AddWorkspaceForm.module.scss';
import type {AppLocale} from '@/db';

interface AddWorkspaceFormProps {
    error: string | null;
    locale: AppLocale;
    name: string;
    onCancel: () => void;
    onNameChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function AddWorkspaceForm({
    error,
    locale,
    name,
    onCancel,
    onNameChange,
    onSubmit,
}: AddWorkspaceFormProps) {
    const addFormSubmitButtonClassName = clsx(styles.addFormButton, 'primary');

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        void onSubmit(event);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onNameChange(event.target.value);
    };

    const handleCancelClick = () => {
        onCancel();
    };

    return (
        <div className={styles.addFormBlock}>
            <form className={styles.addForm} onSubmit={handleFormSubmit}>
                <input
                    className={styles.addInput}
                    value={name}
                    onChange={handleInputChange}
                    placeholder={t(locale, 'workspaceNameAriaLabel')}
                    aria-label={t(locale, 'workspaceNameAriaLabel')}
                    autoFocus
                />

                <button className={addFormSubmitButtonClassName} type="submit">
                    +
                </button>

                <button
                    className={styles.addFormButton}
                    type="button"
                    onClick={handleCancelClick}
                >
                    ×
                </button>
            </form>

            {error ? <small className={styles.formError}>{error}</small> : null}
        </div>
    );
}
