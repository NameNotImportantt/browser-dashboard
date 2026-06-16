import { useMemo, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { buildSearchUrl, getSearchEngineOptions } from "@/app";
import { Select } from "@/components/Select";
import type { SearchCoreProps } from "./types/SearchCoreProps";
import styles from "./SearchCore.module.scss";

export function SearchCore({ activeSearchEngineId, customSearchEngines, onEngineChange }: SearchCoreProps) {
  const [query, setQuery] = useState("");
  const engineOptions = getSearchEngineOptions(customSearchEngines);
  const engineSelectOptions = useMemo(
    () => engineOptions.map(option => ({ value: option.id, label: option.name })),
    [engineOptions],
  );

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

        <Select
          className={styles.engineSelect}
          triggerClassName={styles.engineTrigger}
          value={activeSearchEngineId}
          options={engineSelectOptions}
          onChange={value => void onEngineChange(value)}
          ariaLabel="Поисковая система"
        />
      </form>
    </section>
  );
}
