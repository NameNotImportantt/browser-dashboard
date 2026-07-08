import type {ThemeMode} from '@/db';

export const THEME_ACCENT_COLORS: Record<ThemeMode, string> = {
    dark: '#7c6dff',
    light: '#5f55e6',
};

const ACCENT_SOFT_ALPHA: Record<ThemeMode, number> = {
    dark: 0.22,
    light: 0.18,
};

const ACCENT_GLOW_ALPHA: Record<ThemeMode, number> = {
    dark: 0.42,
    light: 0.25,
};

const ACCENT_HAZE_ALPHA: Record<ThemeMode, number> = {
    dark: 0.16,
    light: 0.14,
};

const ACCENT_SWATCHS = ['#7c6dff', '#17bebb', '#3fb950', '#f59e0b', '#ef476f'];

interface RgbColor {
    red: number;
    green: number;
    blue: number;
}

function parseHexColor(value: string): RgbColor {
    return {
        red: Number.parseInt(value.slice(1, 3), 16),
        green: Number.parseInt(value.slice(3, 5), 16),
        blue: Number.parseInt(value.slice(5, 7), 16),
    };
}

function toRgba(value: string, alpha: number) {
    const {red, green, blue} = parseHexColor(value);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function resolveAccentColor(theme: ThemeMode, customAccentColor: string | null) {
    return customAccentColor ?? THEME_ACCENT_COLORS[theme];
}

export function getAccentColorSwatches(theme: ThemeMode) {
    const themeAccent = THEME_ACCENT_COLORS[theme];

    return [themeAccent, ...ACCENT_SWATCHS.filter(color => color !== themeAccent)];
}

export function applyCustomAccentColor(theme: ThemeMode, customAccentColor: string | null) {
    const root = document.documentElement;

    if (!customAccentColor) {
        root.style.removeProperty('--accent');
        root.style.removeProperty('--accent-soft');
        root.style.removeProperty('--accent-glow');
        root.style.removeProperty('--bg-accent-haze');
        root.style.removeProperty('--shadow-sm');
        root.style.removeProperty('--shadow-md');
        root.style.removeProperty('--shadow-glow');
        return;
    }

    const accentSoft = toRgba(customAccentColor, ACCENT_SOFT_ALPHA[theme]);
    const accentGlow = toRgba(customAccentColor, ACCENT_GLOW_ALPHA[theme]);
    const accentHaze = toRgba(customAccentColor, ACCENT_HAZE_ALPHA[theme]);
    const shadowSm = `0 2px 10px ${toRgba(customAccentColor, theme === 'dark' ? 0.16 : 0.14)}`;

    const shadowMd = [
        `0 0 0 1px ${toRgba(customAccentColor, theme === 'dark' ? 0.16 : 0.14)}`,
        `0 6px 28px ${toRgba(customAccentColor, theme === 'dark' ? 0.24 : 0.18)}`,
        `0 2px 10px ${toRgba(customAccentColor, theme === 'dark' ? 0.14 : 0.1)}`,
    ].join(', ');
    const shadowGlow = [
        `0 0 0 1px ${toRgba(customAccentColor, theme === 'dark' ? 0.1 : 0.08)}`,
        `0 4px 18px ${toRgba(customAccentColor, theme === 'dark' ? 0.16 : 0.12)}`,
    ].join(', ');

    root.style.setProperty('--accent', customAccentColor);
    root.style.setProperty('--accent-soft', accentSoft);
    root.style.setProperty('--accent-glow', accentGlow);
    root.style.setProperty('--bg-accent-haze', accentHaze);
    root.style.setProperty('--shadow-sm', shadowSm);
    root.style.setProperty('--shadow-md', shadowMd);
    root.style.setProperty('--shadow-glow', shadowGlow);
}
