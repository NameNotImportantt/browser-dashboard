import {useEffect, useState} from 'react';
import {t} from '@/app';
import {useNotes, useSettings} from '@/dashboard';
import styles from './NotesWidget.module.scss';

export function NotesWidget() {
    const {noteText, saveNote} = useNotes();
    const {locale} = useSettings();
    const [draft, setDraft] = useState(noteText);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setDraft(noteText);
    }, [noteText]);

    const save = async () => {
        if (draft === noteText) {return;}

        setIsSaving(true);

        try {
            await saveNote(draft);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className={`card ${styles.notesWidget}`}>
            <header className={styles.widgetHeader}>
                <h2>{t(locale, 'navNotes')}</h2>
                {isSaving ? <span className={styles.status}>{t(locale, 'notesSaving')}</span> : null}
            </header>

            <textarea
                className={styles.noteField}
                value={draft}
                onChange={event => setDraft(event.target.value)}
                onBlur={() => void save()}
                placeholder={t(locale, 'notesPlaceholder')}
                aria-label={t(locale, 'notesAriaLabel')}
            />
        </section>
    );
}
