import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { buildSearchUrl, getSearchEngineOptions } from "@/app/searchUtils";
import type { SearchCoreProps } from "@/components/SearchCore/types/SearchCoreProps";
import styles from "./SearchCore.module.scss";

export function SearchCore({ activeSearchEngineId, customSearchEngines, onEngineChange }: SearchCoreProps) {
  const [query, setQuery] = useState("");
  const engineOptions = getSearchEngineOptions(customSearchEngines);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;

    const url = buildSearchUrl(activeSearchEngineId, query, customSearchEngines);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className={styles.searchCore} aria-label="Поиск">
      <form className={styles.searchForm} onSubmit={submit}>
        <label className={styles.searchField}>
          <Search className={styles.searchIcon} size={22} strokeWidth={2.25} aria-hidden />
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
          value={activeSearchEngineId}
          onChange={event => void onEngineChange(event.target.value)}
          aria-label="Поисковая система"
        >
          {engineOptions.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </form>
    </section>
  );
}
