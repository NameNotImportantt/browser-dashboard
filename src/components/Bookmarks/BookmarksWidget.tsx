import { useState, type FormEvent } from "react";
import type { BookmarksWidgetProps } from "@/components/Bookmarks/types/BookmarksWidgetProps";
import styles from "./BookmarksWidget.module.scss";

export function BookmarksWidget({ bookmarks, onAdd, onDelete }: BookmarksWidgetProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onAdd({ title, url });
    setTitle("");
    setUrl("");
  };

  return (
    <section className={`card ${styles.bookmarksWidget}`}>
      <header className={styles.widgetHeader}>
        <h2>Быстрые ссылки</h2>
      </header>

      <form className={styles.stackForm} onSubmit={submit}>
        <input className={styles.inputField} value={title} onChange={event => setTitle(event.target.value)} placeholder="Название" required />
        <input className={styles.inputField} value={url} onChange={event => setUrl(event.target.value)} placeholder="https://example.com" required />
        <button className="primary" type="submit">
          Добавить ссылку
        </button>
      </form>

      <ul className={styles.widgetList}>
        {bookmarks.map(bookmark => (
          <li className={styles.bookmarkItem} key={bookmark.id}>
            <a className={styles.bookmarkLink} href={bookmark.url} target="_blank" rel="noreferrer">
              {bookmark.title}
            </a>
            <button type="button" className={styles.dangerButton} onClick={() => void onDelete(bookmark.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
