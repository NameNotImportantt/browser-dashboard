import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { BackgroundImageError, getSearchEngineOptions, SEARCH_URL_HINT, t, TEXT_COLOR_SWATCHES, THEME_TEXT_COLORS, normalizeHexColor, resolveTextColor } from "@/app";
import { TextColorField } from "./TextColorField";
import type { SettingsPanelProps } from "./types/SettingsPanelProps";
import type { TextColorKey } from "@/db/types";
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

const TEXT_COLOR_FIELDS: Array<{ key: TextColorKey; labelKey: "textColorPrimary" | "textColorSoft" | "textColorMuted" }> = [
  { key: "text", labelKey: "textColorPrimary" },
  { key: "textSoft", labelKey: "textColorSoft" },
  { key: "textMuted", labelKey: "textColorMuted" },
];

function buildTextColorDrafts(
  theme: SettingsPanelProps["settings"]["theme"],
  customTextColors: SettingsPanelProps["settings"]["customTextColors"],
) {
  return {
    text: resolveTextColor(theme, "text", customTextColors),
    textSoft: resolveTextColor(theme, "textSoft", customTextColors),
    textMuted: resolveTextColor(theme, "textMuted", customTextColors),
  };
}

export function SettingsPanel({
  settings,
  onTimeFormatChange,
  onTimezoneChange,
  onLocaleChange,
  onDateFormatChange,
  onTabTitleChange,
  onBackgroundImageChange,
  onBackgroundImageRemove,
  onTextColorChange,
  onTextColorsReset,
  onActiveSearchEngineChange,
  onAddCustomSearchEngine,
  onRemoveCustomSearchEngine,
  onWeatherCityChange,
}: SettingsPanelProps) {
  const locale = settings.locale;
  const theme = settings.theme;
  const [tabTitle, setTabTitle] = useState(settings.tabTitle);
  const [weatherCity, setWeatherCity] = useState(settings.weatherLocation?.label ?? "");
  const [engineName, setEngineName] = useState("");
  const [engineUrl, setEngineUrl] = useState("");
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [textColorDrafts, setTextColorDrafts] = useState(() => buildTextColorDrafts(theme, settings.customTextColors));
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTabTitle(settings.tabTitle);
    setWeatherCity(settings.weatherLocation?.label ?? "");
  }, [settings.tabTitle, settings.weatherLocation?.label]);

  useEffect(() => {
    setTextColorDrafts(buildTextColorDrafts(theme, settings.customTextColors));
  }, [theme, settings.customTextColors]);

  const searchOptions = getSearchEngineOptions(settings.customSearchEngines);
  const colorSwatches = TEXT_COLOR_SWATCHES[theme];

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

  const pickBackgroundImage = () => {
    backgroundInputRef.current?.click();
  };

  const handleBackgroundImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBackgroundError(null);
    try {
      await onBackgroundImageChange(file);
    } catch (error) {
      if (error instanceof BackgroundImageError) {
        if (error.code === "invalidType") {
          setBackgroundError(t(locale, "backgroundImageInvalidType"));
          return;
        }
        if (error.code === "tooLarge") {
          setBackgroundError(t(locale, "backgroundImageTooLarge"));
          return;
        }
        setBackgroundError(t(locale, "backgroundImageDecodeFailed"));
        return;
      }

      setBackgroundError(t(locale, "backgroundImageDecodeFailed"));
    }
  };

  const removeBackgroundImage = async () => {
    setBackgroundError(null);
    await onBackgroundImageRemove();
  };

  const handleTextColorInput = (key: TextColorKey, value: string, commit = false) => {
    setTextColorDrafts(current => ({ ...current, [key]: value }));

    if (!commit) {
      return;
    }

    const normalized = normalizeHexColor(value);
    if (!normalized) {
      setTextColorDrafts(buildTextColorDrafts(theme, settings.customTextColors));
      return;
    }

    const themeDefault = THEME_TEXT_COLORS[theme][key];
    void onTextColorChange(key, normalized === themeDefault ? null : normalized);
  };

  const resetTextColors = async () => {
    await onTextColorsReset();
  };

  return (
    <section className={`card ${styles.settingsPanel}`} aria-label={t(locale, "settings")}>
      <header className={styles.header}>
        <h2>{t(locale, "settings")}</h2>
      </header>

      <div className={styles.rows}>
        <section className={`${styles.section} ${styles.sectionFirst}`}>
          <h3>{t(locale, "settingsGeneral")}</h3>
          <div className={styles.grid}>
              <label className={styles.field}>
                <span>{t(locale, "locale")}</span>
                <select value={settings.locale} onChange={event => void onLocaleChange(event.target.value as typeof settings.locale)}>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
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
          </section>

        <section className={styles.section}>
          <h3>{t(locale, "settingsDateTime")}</h3>
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
                <span>{t(locale, "dateFormat")}</span>
                <select value={settings.dateFormat} onChange={event => void onDateFormatChange(event.target.value as typeof settings.dateFormat)}>
                  <option value="dd.MM.yyyy">dd.MM.yyyy</option>
                  <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                  <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                </select>
              </label>
            </div>
          </section>

        <section className={styles.section}>
          <h3>{t(locale, "searchEngines")}</h3>
            <label className={styles.field}>
              <span>{t(locale, "currentSearchEngines")}</span>
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
              <input
                value={engineUrl}
                onChange={event => setEngineUrl(event.target.value)}
                placeholder={t(locale, "searchEngineLinkPlaceholder")}
              />
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

        <div className={styles.rowDivider} role="separator" aria-hidden />

        <section className={`${styles.section} ${styles.sectionFirst}`}>
          <h3>{t(locale, "settingsAppearance")}</h3>
            <div className={styles.grid}>
              <div className={styles.field}>
                <span>{t(locale, "backgroundImage")}</span>
                <input
                  ref={backgroundInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={event => void handleBackgroundImageSelect(event)}
                />
                <div className={styles.inlineRow}>
                  <button type="button" onClick={pickBackgroundImage}>
                    {t(locale, "chooseBackgroundImage")}
                  </button>
                  {settings.customBackgroundImage ? (
                    <button type="button" className={styles.dangerButton} onClick={() => void removeBackgroundImage()}>
                      {t(locale, "removeBackgroundImage")}
                    </button>
                  ) : null}
                </div>
                <small className={styles.hint}>{t(locale, "backgroundImageHint")}</small>
                {settings.customBackgroundImage ? (
                  <div className={styles.backgroundPreview} role="img" aria-label={t(locale, "backgroundImage")}>
                    <img src={settings.customBackgroundImage} alt="" />
                  </div>
                ) : null}
                {backgroundError ? <small className={styles.error}>{backgroundError}</small> : null}
              </div>

              {TEXT_COLOR_FIELDS.map(field => (
                <TextColorField
                  key={field.key}
                  label={t(locale, field.labelKey)}
                  value={textColorDrafts[field.key]}
                  swatches={colorSwatches[field.key]}
                  onChange={(value, commit) => handleTextColorInput(field.key, value, commit)}
                />
              ))}

              <div className={styles.field}>
                <button type="button" onClick={() => void resetTextColors()}>
                  {t(locale, "resetTextColors")}
                </button>
              </div>
            </div>
          </section>
      </div>
    </section>
  );
}
