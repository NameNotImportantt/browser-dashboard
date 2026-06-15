import { useState, type FormEvent } from "react";
import type { SearchEngine } from "@/db/types/settings";
import type { SearchCoreProps } from "@/components/SearchCore/types/SearchCoreProps";
import styles from "./SearchCore.module.scss";

function buildSearchUrl(engine: SearchEngine, query: string) {
  const encoded = encodeURIComponent(query.trim());
  if (engine === "google") {
    return `https://www.google.com/search?q=${encoded}`;
  }
  return `https://duckduckgo.com/?q=${encoded}`;
}

const ENGINE_OPTIONS: { value: SearchEngine; label: string }[] = [
  { value: "google", label: "Google" },
  { value: "duckduckgo", label: "DuckDuckGo" },
];

export function SearchCore({ engine, onEngineChange }: SearchCoreProps) {
  const [query, setQuery] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;

    const url = buildSearchUrl(engine, query);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className={styles.searchCore} aria-label="Поиск">
      <form className={styles.searchForm} onSubmit={submit}>
        <label className={styles.searchField}>
          <span className={styles.searchIcon} aria-hidden>
            ⌕
          </span>
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Поиск..."
            aria-label="Поиск"
            autoFocus
          />
        </label>

        <select
          className={styles.engineSelect}
          value={engine}
          onChange={event => void onEngineChange(event.target.value as SearchEngine)}
          aria-label="Поисковая система"
        >
          {ENGINE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </form>
    </section>
  );
}
