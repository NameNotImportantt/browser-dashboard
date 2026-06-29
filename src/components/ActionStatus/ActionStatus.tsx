import type {ReactNode} from 'react';
import clsx from 'clsx';
import {Loader} from '@/components/Loader/Loader';
import styles from './ActionStatus.module.scss';
import type {ActionStatusState} from '@/hooks/useActionStatus';

interface ActionStatusProps {
    status: ActionStatusState;
    message?: string | null;
    pendingLabel?: ReactNode;
    className?: string;
}

export function ActionStatus({status, message, pendingLabel, className}: ActionStatusProps) {
    if (status === 'idle') {
        return null;
    }

    if (status === 'pending') {
        return (
            <Loader
                className={className}
                label={pendingLabel}
                tone="inline"
            />
        );
    }

    if (!message) {
        return null;
    }

    const messageClassName = clsx(
        styles.message,
        status === 'error' ? styles.error : styles.success,
        className,
    );

    return (
        <small className={messageClassName} role="status" aria-live="polite">
            {message}
        </small>
    );
}
