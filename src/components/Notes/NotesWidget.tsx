import clsx from 'clsx';
import {Loader} from '@/components';
import {useDashboardCore, useNotes, useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {NotesEditor} from './components/NotesEditor/NotesEditor';
import {NotesSidebar} from './components/NotesSidebar/NotesSidebar';
import styles from './NotesWidget.module.scss';

export function NotesWidget() {
    const {deferredLoading, deferredReady} = useDashboardCore();

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
    const showDeferredLoading = deferredLoading && !deferredReady;

    return (
        <section className={notesWidgetClassName}>
            {showDeferredLoading ? (
                <Loader label={t(locale, 'loadingNotes')} />
            ) : (
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
            )}
        </section>
    );
}
