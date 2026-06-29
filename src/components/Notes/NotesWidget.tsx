import clsx from 'clsx';
import {t} from '@/app';
import {useNotes, useSettings} from '@/dashboard';
import styles from './NotesWidget.module.scss';

export function NotesWidget() {
    const {draftText, flushNoteDraft, saveStatus, setDraftText} = useNotes();
    const {locale} = useSettings();
    const notesWidgetClassName = clsx('card', styles.notesWidget);

    return (
        <section className={notesWidgetClassName}>
            <header className={styles.widgetHeader}>
                <h2>{t(locale, 'navNotes')}</h2>
                {saveStatus === 'saving' ? <span className={styles.status}>{t(locale, 'notesSaving')}</span> : null}
                {saveStatus === 'saved' ? <span className={styles.status}>{t(locale, 'notesSaved')}</span> : null}
            </header>

            <textarea
                className={styles.noteField}
                value={draftText}
                onChange={event => setDraftText(event.target.value)}
                onBlur={() => void flushNoteDraft()}
                placeholder={t(locale, 'notesPlaceholder')}
                aria-label={t(locale, 'notesAriaLabel')}
            />
        </section>
    );
}
