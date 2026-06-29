import {FileText} from 'lucide-react';
import {t} from '@/app';
import {Loader} from '@/components/Loader/Loader';
import styles from './NotesEditor.module.scss';
import type {AppLocale, Note} from '@/db';

interface NotesEditorProps {
  locale: AppLocale;
  activeNote: Note | null;
  draftTitle: string;
  draftText: string;
  saveStatus: 'idle' | 'saving' | 'saved';
  onTitleChange: (title: string) => void;
  onTextChange: (text: string) => void;
  onFlushDraft: () => Promise<void>;
  onCreateNote: () => Promise<void>;
}

export function NotesEditor({
    locale,
    activeNote,
    draftTitle,
    draftText,
    saveStatus,
    onTitleChange,
    onTextChange,
    onFlushDraft,
    onCreateNote,
}: NotesEditorProps) {
    if (!activeNote) {
        return (
            <section className={styles.emptyEditor}>
                <div className={styles.emptyIcon} aria-hidden>
                    <FileText size={22} strokeWidth={2.05} />
                </div>
                <h2 className={styles.emptyTitle}>{t(locale, 'notesEmptyEditorTitle')}</h2>
                <p className={styles.emptyBody}>{t(locale, 'notesEmptyEditorBody')}</p>
                <button type="button" onClick={() => void onCreateNote()}>
                    {t(locale, 'notesCreate')}
                </button>
            </section>
        );
    }

    return (
        <section className={styles.editor}>
            <label className={styles.field}>
                <div className={styles.fieldLabelContainer}>
                    <span className={styles.fieldLabel}>{t(locale, 'notesTitleLabel')}</span>
                    <div className={styles.statusRow}>
                        {saveStatus === 'saving' ? (
                            <Loader label={t(locale, 'notesSaving')} tone="inline" />
                        ) : (
                            <span className={saveStatus === 'saved' ? styles.savedStatus : styles.statusPlaceholder}>
                                {t(locale, 'notesSaved')}
                            </span>
                        )}
                    </div>
                </div>
                <input
                    className={styles.titleField}
                    value={draftTitle}
                    onChange={event => onTitleChange(event.target.value)}
                    onBlur={() => void onFlushDraft()}
                    placeholder={t(locale, 'notesTitlePlaceholder')}
                    aria-label={t(locale, 'notesTitleAriaLabel')}
                />
            </label>

            <label className={styles.bodyField}>
                <span className={styles.fieldLabel}>{t(locale, 'notesBodyLabel')}</span>
                <textarea
                    className={styles.noteField}
                    value={draftText}
                    onChange={event => onTextChange(event.target.value)}
                    onBlur={() => void onFlushDraft()}
                    placeholder={t(locale, 'notesPlaceholder')}
                    aria-label={t(locale, 'notesAriaLabel')}
                />
            </label>
        </section>
    );
}
