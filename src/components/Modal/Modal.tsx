import {useEffect, type MouseEvent, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import clsx from 'clsx';
import styles from './Modal.module.scss';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  closeLabel?: string;
  size?: ModalSize;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function Modal({
    open,
    title,
    onClose,
    closeLabel = 'Close',
    size = 'md',
    children,
    actions,
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
                    <button type="button" className={styles.compactButton} onClick={onClose}>
                        {closeLabel}
                    </button>
                </header>

                {actions ? <div className={styles.modalActions}>{actions}</div> : null}

                <div className={styles.modalBody}>{children}</div>
            </section>
        </div>,
        document.body,
    );
}
