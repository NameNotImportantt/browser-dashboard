import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './Loader.module.scss';

type LoaderVariant = 'compact' | 'fullscreen';
type LoaderTone = 'default' | 'inline';

interface LoaderProps {
  label?: ReactNode;
  ariaLabel?: string;
  className?: string;
  variant?: LoaderVariant;
  tone?: LoaderTone;
}

export function Loader({
    label,
    ariaLabel,
    className,
    variant = 'compact',
    tone = 'default',
}: LoaderProps) {
    const isFullscreen = variant === 'fullscreen';
    const isInline = tone === 'inline';

    const loaderClassName = clsx(
        styles.loader,
        isFullscreen ? styles.loaderFullscreen : styles.loaderCompact,
        isInline ? styles.loaderInline : null,
        className,
    );
    const spinnerClassName = clsx(
        styles.spinner,
        isFullscreen ? styles.spinnerFullscreen : styles.spinnerCompact,
        isInline ? styles.spinnerInline : null,
    );
    const labelClassName = clsx(
        styles.label,
        isFullscreen ? styles.labelFullscreen : styles.labelCompact,
        isInline ? styles.labelInline : null,
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
