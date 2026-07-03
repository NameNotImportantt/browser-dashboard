import clsx from 'clsx';
import styles from './FieldValidation.module.scss';

interface FieldValidationMessageProps {
    className?: string;
    id: string;
    message?: string | null;
}

export const fieldValidationStyles = styles;

export function FieldValidationMessage({className, id, message}: FieldValidationMessageProps) {
    if (!message) {
        return null;
    }

    return (
        <small className={clsx(styles.fieldMessage, className)} id={id} aria-live="polite">
            {message}
        </small>
    );
}
