import {useEffect, useMemo, useState} from 'react';
import {useSettings} from '@/dashboard';
import {t} from '@/i18n';
import {
    getAccentColorSwatches,
    normalizeHexColor,
    resolveAccentColor,
    THEME_ACCENT_COLORS,
} from '@/theme';

interface AppearanceAccentColorField {
    label: string;
    value: string;
    pickerValue: string;
    placeholder: string;
    swatches: string[];
    onChange: (value: string, commit?: boolean) => void;
}

export function useAppearanceAccentColor() {
    const {settings, setAccentColor} = useSettings();
    const locale = settings.locale;
    const theme = settings.theme;

    const resolvedAccentColor = useMemo(
        () => resolveAccentColor(theme, settings.accentColor),
        [settings.accentColor, theme],
    );

    const [accentColorDraft, setAccentColorDraft] = useState(resolvedAccentColor);

    useEffect(() => {
        setAccentColorDraft(resolvedAccentColor);
    }, [resolvedAccentColor]);

    const handleAccentColorChange = (value: string, commit = false) => {
        setAccentColorDraft(value);

        if (!commit) {
            return;
        }

        const normalized = normalizeHexColor(value);

        if (!normalized) {
            return;
        }

        void setAccentColor(normalized);
    };

    const accentColorField = useMemo<AppearanceAccentColorField>(
        () => ({
            label: t(locale, 'accentColor'),
            value: accentColorDraft,
            pickerValue: resolvedAccentColor,
            placeholder: THEME_ACCENT_COLORS[theme],
            swatches: getAccentColorSwatches(theme),
            onChange: handleAccentColorChange,
        }),
        [accentColorDraft, locale, resolvedAccentColor, theme],
    );

    const handleResetAccentColorClick = () => {
        void setAccentColor(null);
    };

    return {
        accentColorField,
        handleResetAccentColorClick,
    };
}
