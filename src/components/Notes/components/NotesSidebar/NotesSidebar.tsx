import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Modal} from '@/components';
import {t} from '@/i18n';
import {getNoteTitle} from '../../utils/notePresentation';
import {NotesListItem} from '../NotesListItem/NotesListItem';
import styles from './NotesSidebar.module.scss';
import type {AppLocale, Note} from '@/db';

interface NotesSidebarProps {
  locale: AppLocale;
  notes: Note[];
  activeNoteId: string | null;
  onCreateNote: () => Promise<void>;
  onSelectNote: (noteId: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

export function NotesSidebar({
    locale,
    notes,
    activeNoteId,
    onCreateNote,
    onSelectNote,
    onDeleteNote,
}: NotesSidebarProps) {
    const [notePendingDelete, setNotePendingDelete] = useState<Note | null>(null);
    const pendingDeleteTitle = notePendingDelete ? getNoteTitle(notePendingDelete, t(locale, 'notesUntitled')) : '';

    const confirmDelete = async () => {
        if (!notePendingDelete) {
            return;
        }

        await onDeleteNote(notePendingDelete.id);
        setNotePendingDelete(null);
    };

    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.header}>
                    <button
                        type="button"
                        className={styles.createButton}
                        onClick={() => void onCreateNote()}
                    >
                        <Plus size={16} strokeWidth={2.2} />
                        <span>{t(locale, 'notesCreate')}</span>
                    </button>
                </div>

                {notes.length > 0 ? (
                    <ul className={styles.list} aria-label={t(locale, 'notesListAriaLabel')}>
                        {notes.map(note => (
                            <NotesListItem
                                key={note.id}
                                locale={locale}
                                note={note}
                                selected={note.id === activeNoteId}
                                onSelect={() => void onSelectNote(note.id)}
                                onDelete={() => setNotePendingDelete(note)}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyTitle}>{t(locale, 'notesEmptyTitle')}</p>
                        <p className={styles.emptyBody}>{t(locale, 'notesEmptyBody')}</p>
                        <button type="button" onClick={() => void onCreateNote()}>
                            {t(locale, 'notesCreate')}
                        </button>
                    </div>
                )}
            </aside>

            <Modal
                open={notePendingDelete !== null}
                title={t(locale, 'notesDeleteConfirmTitle')}
                onClose={() => setNotePendingDelete(null)}
                closeLabel={t(locale, 'cancel')}
                confirmLabel={t(locale, 'notesDeleteConfirmAction')}
                onConfirm={() => void confirmDelete()}
                showCloseIcon
                size="sm"
            >
                <div className={styles.modalCopy}>
                    <p className={styles.modalBody}>{t(locale, 'notesDeleteConfirmMessage')}</p>
                    {notePendingDelete ? <p className={styles.noteName}>{pendingDeleteTitle}</p> : null}
                    <p className={styles.modalWarning}>{t(locale, 'notesDeleteConfirmWarning')}</p>
                </div>
            </Modal>
        </>
    );
}
