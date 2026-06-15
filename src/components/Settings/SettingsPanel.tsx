import { useEffect, useState } from "react";
import { t } from "@/app/i18n";
import { getSearchEngineOptions, SEARCH_URL_HINT } from "@/app/searchUtils";
import type { SettingsPanelProps } from "@/components/Settings/types/SettingsPanelProps";
import styles from "./SettingsPanel.module.scss";

const TIMEZONE_OPTIONS = [
  "auto",
  "Europe/Moscow",
  "Europe/Kaliningrad",
  "Europe/Samara",
  "Asia/Yekaterinburg",
  "Asia/Novosibirsk",
  "Asia/Vladivostok",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "UTC",
];

export function SettingsPanel({
  settings,
  onTimeFormatChange,
  onTimezoneChange,
  onLocaleChange,
  onDateFormatChange,
  onTabTitleChange,
  onActiveSearchEngineChange,
  onAddCustomSearchEngine,
  onRemoveCustomSearchEngine,
  onWeatherCityChange,
}: SettingsPanelProps) {
  const locale = settings.locale;
  const [tabTitle, setTabTitle] = useState(settings.tabTitle);
  const [weatherCity, setWeatherCity] = useState(settings.weatherLocation?.label ?? "");
  const [engineName, setEngineName] = useState("");
  const [engineUrl, setEngineUrl] = useState("");
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    setTabTitle(settings.tabTitle);
    setWeatherCity(settings.weatherLocation?.label ?? "");
  }, [settings.tabTitle, settings.weatherLocation?.label]);

  const searchOptions = getSearchEngineOptions(settings.customSearchEngines);

  const saveTabTitle = async () => {
    await onTabTitleChange(tabTitle);
  };

  const lookupWeatherCity = async () => {
    setWeatherError(null);
    try {
      await onWeatherCityChange(weatherCity);
    } catch (error) {
      setWeatherError(error instanceof Error ? error.message : "Ошибка");
    }
  };

  const addEngine = async () => {
    await onAddCustomSearchEngine({ name: engineName, urlTemplate: engineUrl });
    setEngineName("");
    setEngineUrl("");
  };

  return (
    <section className={`card ${styles.settingsPanel}`} aria-label={t(locale, "settings")}>
      <header className={styles.header}>
        <h2>{t(locale, "settings")}</h2>
      </header>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>{t(locale, "timeFormat")}</span>
          <select value={settings.timeFormat} onChange={event => void onTimeFormatChange(event.target.value as typeof settings.timeFormat)}>
            <option value="24h">{t(locale, "format24h")}</option>
            <option value="12h">{t(locale, "format12h")}</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>{t(locale, "timezone")}</span>
          <select value={settings.timezone} onChange={event => void onTimezoneChange(event.target.value)}>
            {TIMEZONE_OPTIONS.map(zone => (
              <option key={zone} value={zone}>
                {zone === "auto" ? t(locale, "autoTimezone") : zone}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>{t(locale, "locale")}</span>
          <select value={settings.locale} onChange={event => void onLocaleChange(event.target.value as typeof settings.locale)}>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>{t(locale, "dateFormat")}</span>
          <select value={settings.dateFormat} onChange={event => void onDateFormatChange(event.target.value as typeof settings.dateFormat)}>
            <option value="dd.MM.yyyy">dd.MM.yyyy</option>
            <option value="MM/dd/yyyy">MM/dd/yyyy</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>{t(locale, "tabTitle")}</span>
          <div className={styles.inlineRow}>
            <input value={tabTitle} onChange={event => setTabTitle(event.target.value)} />
            <button type="button" onClick={() => void saveTabTitle()}>
              {t(locale, "save")}
            </button>
          </div>
        </label>

        <div className={styles.field}>
          <span>{t(locale, "weatherCity")}</span>
          <div className={styles.inlineRow}>
            <input
              value={weatherCity}
              onChange={event => setWeatherCity(event.target.value)}
              placeholder={t(locale, "weatherCityPlaceholder")}
            />
            <button type="button" onClick={() => void lookupWeatherCity()}>
              {t(locale, "lookupCity")}
            </button>
          </div>
          {settings.weatherLocation ? <small className={styles.hint}>{settings.weatherLocation.label}</small> : null}
          {weatherError ? <small className={styles.error}>{weatherError}</small> : null}
        </div>
      </div>

      <section className={styles.section}>
        <h3>{t(locale, "searchEngines")}</h3>
        <label className={styles.field}>
          <span>{t(locale, "searchEngines")}</span>
          <select value={settings.activeSearchEngineId} onChange={event => void onActiveSearchEngineChange(event.target.value)}>
            {searchOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.customEngineForm}>
          <input value={engineName} onChange={event => setEngineName(event.target.value)} placeholder="Name" />
          <input value={engineUrl} onChange={event => setEngineUrl(event.target.value)} placeholder={SEARCH_URL_HINT} />
          <small className={styles.hint}>
            {t(locale, "customSearchFormat")} <code>{SEARCH_URL_HINT}</code>
          </small>
          <button type="button" className="primary" onClick={() => void addEngine()}>
            {t(locale, "addSearchEngine")}
          </button>
        </div>

        {settings.customSearchEngines.length > 0 ? (
          <ul className={styles.engineList}>
            {settings.customSearchEngines.map(engine => (
              <li key={engine.id}>
                <span>
                  {engine.name}: {engine.urlTemplate}
                </span>
                <button type="button" className={styles.dangerButton} onClick={() => void onRemoveCustomSearchEngine(engine.id)}>
                  {t(locale, "remove")}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </section>
  );
}
