import {useId, type MouseEvent, type ReactNode} from 'react';
import clsx from 'clsx';
import {CircleHelp} from 'lucide-react';
import {IconButton} from '@/components/IconButton/IconButton';
import {t} from '@/i18n';
import styles from './HintTooltip.module.scss';
import type {AppLocale} from '@/db';

interface HintTooltipProps {
    hint: string;
    label: ReactNode;
    locale: AppLocale;
    className?: string;
    inline?: boolean;
}

export function HintTooltip({
    hint,
    label,
    locale,
    className,
    inline = false,
}: HintTooltipProps) {
    const tooltipId = useId();
    const RootTag = inline ? 'span' : 'div';

    const rootClassName = clsx(
        styles.root,
        inline ? styles.inline : null,
        className,
    );

    const handleTriggerMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <RootTag className={rootClassName}>
            {label}

            <span className={styles.tooltipAnchor}>
                <IconButton
                    className={styles.trigger}
                    withChrome={false}
                    aria-label={t(locale, 'hintTooltipAriaLabel')}
                    aria-describedby={tooltipId}
                    onMouseDown={handleTriggerMouseDown}
                    onClick={handleTriggerClick}
                >
                    <CircleHelp size={14} strokeWidth={2.15} />
                </IconButton>

                <span id={tooltipId} role="tooltip" className={styles.tooltip}>
                    {hint}
                </span>
            </span>
        </RootTag>
    );
}
