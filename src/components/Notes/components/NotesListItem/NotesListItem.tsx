import clsx from 'clsx';
import {FileText, X} from 'lucide-react';
import {t} from '@/i18n';
import {getNotePreview, getNoteTitle} from '../../utils/notePresentation';
import styles from './NotesListItem.module.scss';
import type {AppLocale, Note} from '@/db';

interface NotesListItemProps {
  locale: AppLocale;
  note: Note;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function NotesListItem({
    locale,
    note,
    selected,
    onSelect,
    onDelete,
}: NotesListItemProps) {
    const itemClassName = clsx(styles.listItem, selected ? styles.itemSelected : null);
    const title = getNoteTitle(note, t(locale, 'notesUntitled'));
    const preview = getNotePreview(note.text);

    return (
        <li
            className={itemClassName}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            onClick={onSelect}
            onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect();
                }
            }}
        >
            <div className={styles.selectButton}>
                <span className={styles.leadingIcon} aria-hidden>
                    <FileText size={16} strokeWidth={2.15} />
                </span>
                <div className={styles.content}>
                    <div className={styles.titleContainer}>
                        <span className={styles.title}>{title}</span>
                        <button
                            type="button"
                            className={styles.deleteButton}
                            aria-label={t(locale, 'notesDeleteNote')}
                            onClick={event => {
                                event.stopPropagation();
                                onDelete();
                            }}
                        >
                            <X className={styles.deleteIcon} size={17} strokeWidth={2.7} />
                        </button>
                    </div>
                    <span className={styles.preview}>{preview}</span>
                </div>
            </div>
        </li>
    );
}
