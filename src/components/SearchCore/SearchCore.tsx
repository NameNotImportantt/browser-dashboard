import { useMemo, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { buildSearchUrl, getSearchEngineOptions, t } from "@/app";
import { Select } from "@/components/Select";
import type { SearchCoreProps } from "./types/SearchCoreProps";
import styles from "./SearchCore.module.scss";

export function SearchCore({ locale, activeSearchEngineId, customSearchEngines, onEngineChange }: SearchCoreProps) {
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
    <section className={styles.searchCore} aria-label={t(locale, "searchAriaLabel")}>
      <form className={styles.searchForm} onSubmit={submit}>
        <label className={styles.searchField}>
          <Search className={styles.searchIcon} size={22} strokeWidth={2.25} aria-hidden />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={t(locale, "searchPlaceholder")}
            aria-label={t(locale, "searchAriaLabel")}
            autoFocus
          />
        </label>

        <Select
          className={styles.engineSelect}
          triggerClassName={styles.engineTrigger}
          value={activeSearchEngineId}
          options={engineSelectOptions}
          onChange={value => void onEngineChange(value)}
          ariaLabel={t(locale, "searchEngineAriaLabel")}
        />
      </form>
    </section>
  );
}
