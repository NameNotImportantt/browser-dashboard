import {useEffect, useRef} from 'react';
import clsx from 'clsx';
import {CircleHelp} from 'lucide-react';
import {KEYBOARD_SHORTCUTS, t} from '@/app';
import {screenMenuStyles} from '@/components';
import styles from './KeyboardHelpAction.module.scss';
import type {AppLocale} from '@/db';

interface KeyboardHelpActionProps {
  locale: AppLocale;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function KeyboardHelpAction({locale, open, onOpen, onClose}: KeyboardHelpActionProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const helpButtonClassName = clsx(screenMenuStyles.iconButton, styles.helpButton);
    const closeButtonClassName = clsx(screenMenuStyles.iconButton, styles.closeButton);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;

            if (wrapRef.current?.contains(target)) {
                return;
            }

            onClose();
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
        };
    }, [onClose, open]);

    return (
        <div ref={wrapRef} className={styles.helpAction}>
            {open ? (
                <div className={styles.popover} role="dialog" aria-modal="false" aria-label={t(locale, 'keyboardHelpTitle')}>
                    <div className={styles.popoverHeader}>
                        <h3 className={styles.popoverTitle}>{t(locale, 'keyboardHelpTitle')}</h3>
                        <button
                            type="button"
                            className={closeButtonClassName}
                            onClick={onClose}
                            aria-label={t(locale, 'close')}
                        >
                            ×
                        </button>
                    </div>

                    <ul className={styles.shortcutList}>
                        {KEYBOARD_SHORTCUTS.map(shortcut => (
                            <li key={shortcut.id} className={styles.shortcutItem}>
                                <span className={styles.shortcutKeys} aria-hidden>
                                    {shortcut.keys.map(key => (
                                        <span key={`${shortcut.id}-${key}`} className={styles.shortcutKey}>
                                            {key}
                                        </span>
                                    ))}
                                </span>
                                <span className={styles.shortcutDescription}>{t(locale, shortcut.descriptionKey)}</span>
                            </li>
                        ))}
                    </ul>

                    <p className={styles.popoverHint}>{t(locale, 'keyboardHelpInputHint')}</p>
                </div>
            ) : null}

            <button
                type="button"
                className={helpButtonClassName}
                onClick={open ? onClose : onOpen}
                aria-label={t(locale, 'keyboardHelpButton')}
                aria-haspopup="dialog"
                aria-expanded={open}
            >
                <CircleHelp size={16} strokeWidth={2.15} aria-hidden />
            </button>
        </div>
    );
}
