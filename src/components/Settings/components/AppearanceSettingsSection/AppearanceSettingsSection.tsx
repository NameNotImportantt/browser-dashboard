import {useEffect, useMemo, useRef, useState, type ChangeEvent} from 'react';
import clsx from 'clsx';
import {Palette} from 'lucide-react';
import {ActionStatus} from '@/components';
import {useSettings} from '@/dashboard';
import {BackgroundImageError} from '@/data/settings';
import {useActionStatus} from '@/hooks/useActionStatus';
import {t} from '@/i18n';
import {
    getTextColorSwatches,
    normalizeHexColor,
    resolveTextColor,
    THEME_TEXT_COLORS,
} from '@/theme';
import {TEXT_COLOR_FIELDS} from '../../constants';
import styles from '../../SettingsPanel.module.scss';
import {SettingsSectionHeader} from '../SettingsSectionHeader';
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

    const resolvedTextColors = useMemo(
        () => buildTextColorDrafts(theme, settings.customTextColors),
        [theme, settings.customTextColors],
    );

    const [textColorDrafts, setTextColorDrafts] = useState(() => resolvedTextColors);
    const backgroundStatus = useActionStatus();
    const backgroundInputRef = useRef<HTMLInputElement>(null);
    const sectionClassName = clsx(styles.section, styles.sectionFirst);

    useEffect(() => {
        setTextColorDrafts(resolvedTextColors);
    }, [resolvedTextColors]);

    const pickBackgroundImage = () => {
        backgroundInputRef.current?.click();
    };

    const handleBackgroundImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        event.target.value = '';

        if (!file) {return;}

        backgroundStatus.start();

        try {
            await setBackgroundImageFromFile(file);
            backgroundStatus.succeed(t(locale, 'backgroundImageUpdated'));
        } catch (error) {
            if (error instanceof BackgroundImageError) {
                if (error.code === 'invalidType') {
                    backgroundStatus.fail(t(locale, 'backgroundImageInvalidType'));
                    return;
                }

                if (error.code === 'tooLarge') {
                    backgroundStatus.fail(t(locale, 'backgroundImageTooLarge'));
                    return;
                }

                backgroundStatus.fail(t(locale, 'backgroundImageDecodeFailed'));
                return;
            }

            backgroundStatus.fail(t(locale, 'backgroundImageDecodeFailed'));
        }
    };

    const handleBackgroundImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        void handleBackgroundImageSelect(event);
    };

    const removeBackgroundImage = async () => {
        backgroundStatus.start();

        try {
            await clearBackgroundImage();
            backgroundStatus.succeed(t(locale, 'backgroundImageRemoved'));
        } catch {
            backgroundStatus.fail(t(locale, 'backgroundImageDecodeFailed'));
        }
    };

    const handleRemoveBackgroundImageClick = () => {
        void removeBackgroundImage();
    };

    const handleTextColorInput = (key: TextColorKey, value: string, commit = false) => {
        setTextColorDrafts(current => ({...current, [key]: value}));

        if (!commit) {
            return;
        }

        const normalized = normalizeHexColor(value);

        if (!normalized) {
            setTextColorDrafts(resolvedTextColors);
            return;
        }

        const themeDefault = THEME_TEXT_COLORS[theme][key];

        void setTextColor(key, normalized === themeDefault ? null : normalized);
    };

    const handlePrimaryTextColorChange = (value: string, commit = false) => {
        handleTextColorInput('text', value, commit);
    };

    const handleSoftTextColorChange = (value: string, commit = false) => {
        handleTextColorInput('textSoft', value, commit);
    };

    const handleMutedTextColorChange = (value: string, commit = false) => {
        handleTextColorInput('textMuted', value, commit);
    };

    const textColorFieldHandlers: Record<TextColorKey, (value: string, commit?: boolean) => void> = {
        text: handlePrimaryTextColorChange,
        textSoft: handleSoftTextColorChange,
        textMuted: handleMutedTextColorChange,
    };

    const textColorFields = TEXT_COLOR_FIELDS.map(field => ({
        key: field.key,
        label: t(locale, field.labelKey),
        value: textColorDrafts[field.key],
        pickerValue: resolvedTextColors[field.key],
        placeholder: THEME_TEXT_COLORS[theme][field.key],
        swatches: getTextColorSwatches(theme, field.key),
        onChange: textColorFieldHandlers[field.key],
    }));

    const resetTextColors = async () => {
        await resetSettingsTextColors();
    };

    const handleResetTextColorsClick = () => {
        void resetTextColors();
    };

    const handleBackgroundScrimChange = (event: ChangeEvent<HTMLInputElement>) => {
        void setBackgroundScrimOpacity(Number(event.target.value));
    };

    return (
        <section className={sectionClassName}>
            <SettingsSectionHeader title={t(locale, 'settingsAppearance')} icon={Palette} />

            <div className={styles.grid}>
                <div className={styles.field}>
                    <span className={styles.fieldLabel}>{t(locale, 'backgroundImage')}</span>

                    <input
                        ref={backgroundInputRef}
                        type="file"
                        accept="image/*"
                        className={styles.hiddenInput}
                        onChange={handleBackgroundImageChange}
                    />

                    <div className={styles.inlineRow}>
                        <button type="button" onClick={pickBackgroundImage}>
                            {t(locale, 'chooseBackgroundImage')}
                        </button>

                        {settings.customBackgroundImage ? (
                            <button type="button" className={styles.dangerButton} onClick={handleRemoveBackgroundImageClick}>
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
                                    onChange={handleBackgroundScrimChange}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={settings.backgroundScrimOpacity}
                                />
                            </label>

                            <small className={styles.hint}>{t(locale, 'backgroundScrimHint')}</small>
                        </div>
                    ) : null}

                    <ActionStatus
                        status={backgroundStatus.status}
                        message={backgroundStatus.message}
                        pendingLabel={t(locale, 'backgroundImageProcessing')}
                    />
                </div>

                {textColorFields.map(field => (
                    <TextColorField
                        key={field.key}
                        label={field.label}
                        value={field.value}
                        pickerValue={field.pickerValue}
                        placeholder={field.placeholder}
                        swatches={field.swatches}
                        onChange={field.onChange}
                    />
                ))}

                <div className={styles.field}>
                    <button type="button" onClick={handleResetTextColorsClick}>
                        {t(locale, 'resetTextColors')}
                    </button>
                </div>
            </div>
        </section>
    );
}
