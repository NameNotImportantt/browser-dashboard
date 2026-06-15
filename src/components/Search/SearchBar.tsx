import { useState, type FormEvent } from "react";
import type { SearchEngine } from "@/db/types/settings";
import type { SearchBarProps } from "@/components/Search/types/SearchBarProps";
import styles from "./SearchBar.module.scss";

function buildSearchUrl(engine: SearchEngine, query: string) {
  const encoded = encodeURIComponent(query.trim());
  if (engine === "google") {
    return `https://www.google.com/search?q=${encoded}`;
  }
  return `https://duckduckgo.com/?q=${encoded}`;
}

export function SearchBar({ engine }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;

    const url = buildSearchUrl(engine, query);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form className={styles.searchForm} onSubmit={submit}>
      <label className={styles.searchField}>
        <span className={styles.searchIcon} aria-hidden>
          ⌕
        </span>
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Поиск по интернету..."
          aria-label="Поиск"
        />
      </label>
      <button className="primary" type="submit">
        Искать
      </button>
    </form>
  );
}
