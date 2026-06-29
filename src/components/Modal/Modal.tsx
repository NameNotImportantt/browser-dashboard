import {useEffect, type MouseEvent, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import {X} from 'lucide-react';
import styles from './Modal.module.scss';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  closeLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmDisabled?: boolean;
  confirmButtonClassName?: string;
  footerContent?: ReactNode;
  showCloseIcon?: boolean;
  size?: ModalSize;
  children: ReactNode;
  className?: string;
}

export function Modal({
    open,
    title,
    onClose,
    closeLabel = 'Close',
    confirmLabel,
    onConfirm,
    confirmDisabled = false,
    confirmButtonClassName,
    footerContent,
    showCloseIcon = false,
    size = 'md',
    children,
    className,
}: ModalProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const sizeClassName = size === 'sm' ? styles.modalCardSm : size === 'lg' ? styles.modalCardLg : styles.modalCardMd;
    const modalClassName = clsx(styles.modalCard, sizeClassName, className);
    const modalCardClassName = clsx('card', modalClassName);

    const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div className={styles.modalOverlay} onMouseDown={handleOverlayMouseDown}>
            <section className={modalCardClassName} role="dialog" aria-modal="true" aria-label={title}>
                <header className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>{title}</h3>
                    {showCloseIcon ? (
                        <button
                            type="button"
                            className={styles.closeIconButton}
                            aria-label={closeLabel}
                            onClick={onClose}
                        >
                            <X size={16} strokeWidth={2.35} />
                        </button>
                    ) : null}
                </header>

                <div className={styles.modalBody}>{children}</div>

                <footer className={styles.modalFooter}>
                    <div className={styles.modalFooterSide}>{footerContent}</div>
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.compactButton} onClick={onClose}>
                            {closeLabel}
                        </button>
                        {onConfirm && confirmLabel ? (
                            <button
                                type="button"
                                className={clsx(confirmButtonClassName, styles.compactButton)}
                                onClick={onConfirm}
                                disabled={confirmDisabled}
                            >
                                {confirmLabel}
                            </button>
                        ) : null}
                    </div>
                </footer>
            </section>
        </div>,
        document.body,
    );
}
