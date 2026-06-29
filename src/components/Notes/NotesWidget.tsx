import clsx from 'clsx';
import {useNotes, useSettings} from '@/dashboard';
import {NotesEditor} from './components/NotesEditor/NotesEditor';
import {NotesSidebar} from './components/NotesSidebar/NotesSidebar';
import styles from './NotesWidget.module.scss';

export function NotesWidget() {
    const {
        activeNote,
        createNote,
        deleteNote,
        draftText,
        draftTitle,
        flushNoteDraft,
        notes,
        saveStatus,
        selectNote,
        setDraftText,
        setDraftTitle,
    } = useNotes();

    const {locale} = useSettings();
    const notesWidgetClassName = clsx('card', styles.notesWidget);

    return (
        <section className={notesWidgetClassName}>
            <div className={styles.layout}>
                <NotesSidebar
                    locale={locale}
                    notes={notes}
                    activeNoteId={activeNote?.id ?? null}
                    onCreateNote={createNote}
                    onSelectNote={selectNote}
                    onDeleteNote={deleteNote}
                />
                <NotesEditor
                    locale={locale}
                    activeNote={activeNote}
                    draftTitle={draftTitle}
                    draftText={draftText}
                    saveStatus={saveStatus}
                    onTitleChange={setDraftTitle}
                    onTextChange={setDraftText}
                    onFlushDraft={flushNoteDraft}
                    onCreateNote={createNote}
                />
            </div>
        </section>
    );
}
