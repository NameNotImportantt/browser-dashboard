import { useState, type FormEvent } from "react";
import type { QuickLinksProps } from "@/components/QuickLinks/types/QuickLinksProps";
import styles from "./QuickLinks.module.scss";

export function QuickLinks({ bookmarks, onAdd, onDelete }: QuickLinksProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onAdd({ title, url });
    setTitle("");
    setUrl("");
    setIsAdding(false);
  };

  return (
    <section className={styles.quickLinks} aria-label="Быстрые ссылки">
      <div className={styles.linksRow}>
        {bookmarks.map((bookmark, index) => (
          <span className={styles.linkItem} key={bookmark.id}>
            {index > 0 ? <span className={styles.separator} aria-hidden>·</span> : null}
            <a href={bookmark.url} target="_blank" rel="noreferrer">
              {bookmark.title}
            </a>
            <button type="button" className={styles.removeButton} onClick={() => void onDelete(bookmark.id)} aria-label={`Удалить ${bookmark.title}`}>
              ×
            </button>
          </span>
        ))}

        <button type="button" className={styles.addButton} onClick={() => setIsAdding(value => !value)}>
          + Add Link
        </button>
      </div>

      {isAdding ? (
        <form className={styles.addForm} onSubmit={submit}>
          <input value={title} onChange={event => setTitle(event.target.value)} placeholder="Название" required />
          <input value={url} onChange={event => setUrl(event.target.value)} placeholder="https://example.com" required />
          <button className="primary" type="submit">
            Добавить
          </button>
          <button type="button" onClick={() => setIsAdding(false)}>
            Отмена
          </button>
        </form>
      ) : null}
    </section>
  );
}
