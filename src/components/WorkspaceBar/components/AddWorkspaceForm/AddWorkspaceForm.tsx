import type {FormEvent,ChangeEvent} from 'react';
import clsx from 'clsx';
import {FieldValidationMessage, fieldValidationStyles, type FieldValidationAriaProps} from '@/components';
import {t} from '@/i18n';
import styles from './AddWorkspaceForm.module.scss';
import type {AppLocale} from '@/db';

interface AddWorkspaceFormProps {
    errorMessage: string | null;
    inputAriaProps: FieldValidationAriaProps;
    isInvalid: boolean;
    locale: AppLocale;
    messageId: string;
    name: string;
    onCancel: () => void;
    onNameChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function AddWorkspaceForm({
    errorMessage,
    inputAriaProps,
    isInvalid,
    locale,
    messageId,
    name,
    onCancel,
    onNameChange,
    onSubmit,
}: AddWorkspaceFormProps) {
    const addFormSubmitButtonClassName = clsx(styles.addFormButton, 'primary');

    const addInputClassName = clsx(
        styles.addInput,
        isInvalid && fieldValidationStyles.fieldControlInvalid,
    );

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
                    className={addInputClassName}
                    value={name}
                    onChange={handleInputChange}
                    placeholder={t(locale, 'workspaceNameAriaLabel')}
                    aria-label={t(locale, 'workspaceNameAriaLabel')}
                    {...inputAriaProps}
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

            <FieldValidationMessage
                className={styles.formError}
                id={messageId}
                message={errorMessage}
            />
        </div>
    );
}
