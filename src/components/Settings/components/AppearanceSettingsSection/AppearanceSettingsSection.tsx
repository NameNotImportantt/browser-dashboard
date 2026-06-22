import {useEffect, useRef, useState, type ChangeEvent} from 'react';
import {
    BackgroundImageError,
    getTextColorSwatches,
    normalizeHexColor,
    resolveTextColor,
    t,
    THEME_TEXT_COLORS,
} from '@/app';
import {useSettings} from '@/dashboard';
import {TEXT_COLOR_FIELDS} from '../../constants';
import styles from '../../SettingsPanel.module.scss';
import {TextColorField} from '../TextColorField';
import type {AppSettings, TextColorKey} from '@/db';

function buildTextColorDrafts(
    theme: AppSettings['theme'],
    customTextColors: AppSettings['customTextColors'],
) {
    return {
        text: resolveTextColor(theme, 'text', customTextColors),
        textSoft: resolveTextColor(theme, 'textSoft', customTextColors),
        textMuted: resolveTextColor(theme, 'textMuted', customTextColors),
    };
}

export function AppearanceSettingsSection() {
    const {
        settings,
        setBackgroundImageFromFile,
        clearBackgroundImage,
        setBackgroundScrimOpacity,
        setTextColor,
        resetTextColors: resetSettingsTextColors,
    } = useSettings();

    const locale = settings.locale;
    const theme = settings.theme;
    const [backgroundError, setBackgroundError] = useState<string | null>(null);
    const [textColorDrafts, setTextColorDrafts] = useState(() => buildTextColorDrafts(theme, settings.customTextColors));
    const backgroundInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTextColorDrafts(buildTextColorDrafts(theme, settings.customTextColors));
    }, [theme, settings.customTextColors]);

    const pickBackgroundImage = () => {
        backgroundInputRef.current?.click();
    };

    const handleBackgroundImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        event.target.value = '';

        if (!file) {return;}

        setBackgroundError(null);

        try {
            await setBackgroundImageFromFile(file);
        } catch (error) {
            if (error instanceof BackgroundImageError) {
                if (error.code === 'invalidType') {
                    setBackgroundError(t(locale, 'backgroundImageInvalidType'));
                    return;
                }

                if (error.code === 'tooLarge') {
                    setBackgroundError(t(locale, 'backgroundImageTooLarge'));
                    return;
                }

                setBackgroundError(t(locale, 'backgroundImageDecodeFailed'));
                return;
            }

            setBackgroundError(t(locale, 'backgroundImageDecodeFailed'));
        }
    };

    const removeBackgroundImage = async () => {
        setBackgroundError(null);
        await clearBackgroundImage();
    };

    const handleTextColorInput = (key: TextColorKey, value: string, commit = false) => {
        setTextColorDrafts(current => ({...current, [key]: value}));

        if (!commit) {
            return;
        }

        const normalized = normalizeHexColor(value);

        if (!normalized) {
            setTextColorDrafts(buildTextColorDrafts(theme, settings.customTextColors));
            return;
        }

        const themeDefault = THEME_TEXT_COLORS[theme][key];

        void setTextColor(key, normalized === themeDefault ? null : normalized);
    };

    const resetTextColors = async () => {
        await resetSettingsTextColors();
    };

    return (
        <section className={`${styles.section} ${styles.sectionFirst}`}>
            <h3>{t(locale, 'settingsAppearance')}</h3>
            <div className={styles.grid}>
                <div className={styles.field}>
                    <span className={styles.fieldLabel}>{t(locale, 'backgroundImage')}</span>
                    <input
                        ref={backgroundInputRef}
                        type="file"
                        accept="image/*"
                        className={styles.hiddenInput}
                        onChange={event => void handleBackgroundImageSelect(event)}
                    />
                    <div className={styles.inlineRow}>
                        <button type="button" onClick={pickBackgroundImage}>
                            {t(locale, 'chooseBackgroundImage')}
                        </button>
                        {settings.customBackgroundImage ? (
                            <button type="button" className={styles.dangerButton} onClick={() => void removeBackgroundImage()}>
                                {t(locale, 'removeBackgroundImage')}
                            </button>
                        ) : null}
                    </div>
                    <small className={styles.hint}>{t(locale, 'backgroundImageHint')}</small>
                    {settings.customBackgroundImage ? (
                        <div className={styles.backgroundPreview} role="img" aria-label={t(locale, 'backgroundImage')}>
                            <img src={settings.customBackgroundImage} alt="" />
                        </div>
                    ) : null}
                    {settings.customBackgroundImage ? (
                        <div className={styles.field}>
                            <label className={styles.scrimField} htmlFor="background-scrim">
                                <span className={styles.scrimLabel}>
                                    {t(locale, 'backgroundScrim')}: {settings.backgroundScrimOpacity}%
                                </span>
                                <input
                                    id="background-scrim"
                                    className={styles.scrimRange}
                                    type="range"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={settings.backgroundScrimOpacity}
                                    onChange={event => void setBackgroundScrimOpacity(Number(event.target.value))}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={settings.backgroundScrimOpacity}
                                />
                            </label>
                            <small className={styles.hint}>{t(locale, 'backgroundScrimHint')}</small>
                        </div>
                    ) : null}
                    {backgroundError ? <small className={styles.error}>{backgroundError}</small> : null}
                </div>

                {TEXT_COLOR_FIELDS.map(field => (
                    <TextColorField
                        key={field.key}
                        label={t(locale, field.labelKey)}
                        value={textColorDrafts[field.key]}
                        placeholder={THEME_TEXT_COLORS[theme][field.key]}
                        swatches={getTextColorSwatches(theme, field.key)}
                        onChange={(value, commit) => handleTextColorInput(field.key, value, commit)}
                    />
                ))}

                <div className={styles.field}>
                    <button type="button" onClick={() => void resetTextColors()}>
                        {t(locale, 'resetTextColors')}
                    </button>
                </div>
            </div>
        </section>
    );
}
