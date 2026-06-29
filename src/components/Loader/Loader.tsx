import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './Loader.module.scss';

type LoaderVariant = 'compact' | 'fullscreen';

interface LoaderProps {
  label?: ReactNode;
  ariaLabel?: string;
  className?: string;
  variant?: LoaderVariant;
}

export function Loader({
    label,
    ariaLabel,
    className,
    variant = 'compact',
}: LoaderProps) {
    const isFullscreen = variant === 'fullscreen';
    const loaderClassName = clsx(
        styles.loader,
        isFullscreen ? styles.loaderFullscreen : styles.loaderCompact,
        className,
    );
    const spinnerClassName = clsx(
        styles.spinner,
        isFullscreen ? styles.spinnerFullscreen : styles.spinnerCompact,
    );
    const labelClassName = clsx(
        styles.label,
        isFullscreen ? styles.labelFullscreen : styles.labelCompact,
    );

    return (
        <div
            className={loaderClassName}
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label={ariaLabel}
        >
            <span className={spinnerClassName} aria-hidden />
            {label ? <span className={labelClassName}>{label}</span> : null}
        </div>
    );
}
