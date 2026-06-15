import { useState, type FormEvent } from "react";
import { buildSearchUrl } from "@/app/searchUtils";
import type { SearchBarProps } from "@/components/Search/types/SearchBarProps";
import styles from "./SearchBar.module.scss";

export function SearchBar({ activeSearchEngineId, customSearchEngines }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;

    const url = buildSearchUrl(activeSearchEngineId, query, customSearchEngines);
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
