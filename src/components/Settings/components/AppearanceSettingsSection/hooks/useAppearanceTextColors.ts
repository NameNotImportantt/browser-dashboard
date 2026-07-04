import {useEffect, useMemo, useState} from 'react';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {
    getTextColorSwatches,
    normalizeHexColor,
    resolveTextColor,
    THEME_TEXT_COLORS,
} from '@/theme';
import {TEXT_COLOR_FIELDS} from '../../../constants';
import type {AppSettings, TextColorKey} from '@/db';

interface AppearanceTextColorField {
    key: TextColorKey;
    label: string;
    value: string;
    pickerValue: string;
    placeholder: string;
    swatches: string[];
    onChange: (value: string, commit?: boolean) => void;
}

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

export function useAppearanceTextColors() {
    const {settings, setTextColor, resetTextColors} = useSettings();
    const locale = settings.locale;
    const theme = settings.theme;

    const resolvedTextColors = useMemo(
        () => buildTextColorDrafts(theme, settings.customTextColors),
        [theme, settings.customTextColors],
    );

    const [textColorDrafts, setTextColorDrafts] = useState(() => resolvedTextColors);

    useEffect(() => {
        setTextColorDrafts(resolvedTextColors);
    }, [resolvedTextColors]);

    const handleTextColorInput = (key: TextColorKey, value: string, commit = false) => {
        setTextColorDrafts(current => ({...current, [key]: value}));

        if (!commit) {
            return;
        }

        const normalized = normalizeHexColor(value);

        if (!normalized) {
            return;
        }

        const themeDefault = THEME_TEXT_COLORS[theme][key];

        void setTextColor(key, normalized === themeDefault ? null : normalized);
    };

    const textColorFields = useMemo<AppearanceTextColorField[]>(
        () => TEXT_COLOR_FIELDS.map(field => ({
            key: field.key,
            label: t(locale, field.labelKey),
            value: textColorDrafts[field.key],
            pickerValue: resolvedTextColors[field.key],
            placeholder: THEME_TEXT_COLORS[theme][field.key],
            swatches: getTextColorSwatches(theme, field.key),
            onChange: (value, commit) => handleTextColorInput(field.key, value, commit),
        })),
        [locale, resolvedTextColors, textColorDrafts, theme],
    );

    const handleResetTextColorsClick = () => {
        void resetTextColors();
    };

    return {
        textColorFields,
        handleResetTextColorsClick,
    };
}
