import { useEffect, useState } from "react";
import type { NotesWidgetProps } from "./types/NotesWidgetProps";
import styles from "./NotesWidget.module.scss";

export function NotesWidget({ text, onSave }: NotesWidgetProps) {
  const [draft, setDraft] = useState(text);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDraft(text);
  }, [text]);

  const save = async () => {
    if (draft === text) return;
    setIsSaving(true);
    try {
      await onSave(draft);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={`card ${styles.notesWidget}`}>
      <header className={styles.widgetHeader}>
        <h2>Заметки</h2>
        {isSaving ? <span className={styles.status}>Сохранение...</span> : null}
      </header>

      <textarea
        className={styles.noteField}
        value={draft}
        onChange={event => setDraft(event.target.value)}
        onBlur={() => void save()}
        placeholder="Быстрые мысли и напоминания..."
        aria-label="Заметка"
      />
    </section>
  );
}
