import type { CustomTextColors, TextColorKey, ThemeMode } from "@/db/types";

export const THEME_TEXT_COLORS: Record<ThemeMode, Record<TextColorKey, string>> = {
  dark: {
    text: "#e7ecff",
    textSoft: "#aab3c7",
    textMuted: "#6f7a90",
  },
  light: {
    text: "#1d2433",
    textSoft: "#4f5d78",
    textMuted: "#6f7a90",
  },
};

export const TEXT_COLOR_CSS_VARS: Record<TextColorKey, string> = {
  text: "--text",
  textSoft: "--text-soft",
  textMuted: "--text-muted",
};

const READABLE_ON_LIGHT: Record<TextColorKey, readonly [string, string]> = {
  text: ["#080c14", "#1a3560"],
  textSoft: ["#252f42", "#4a5f7a"],
  textMuted: ["#384756", "#5f7389"],
};

const READABLE_ON_DARK: Record<TextColorKey, readonly [string, string]> = {
  text: ["#f0f3ff", "#ddb8ff"],
  textSoft: ["#b8c5da", "#89a8cc"],
  textMuted: ["#b5c0d0", "#7a92ab"],
};

export function getTextColorSwatches(theme: ThemeMode, key: TextColorKey): string[] {
  const [lightA, lightB] = READABLE_ON_LIGHT[key];
  const [darkA, darkB] = READABLE_ON_DARK[key];

  return [THEME_TEXT_COLORS[theme][key], lightA, lightB, darkA, darkB];
}

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function isValidHexColor(value: string) {
  return HEX_PATTERN.test(value.trim());
}

export function normalizeHexColor(value: string) {
  const trimmed = value.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  if (!isValidHexColor(withHash)) {
    return null;
  }

  return withHash.toLowerCase();
}

export function resolveTextColor(theme: ThemeMode, key: TextColorKey, custom: CustomTextColors | null) {
  return custom?.[key] ?? THEME_TEXT_COLORS[theme][key];
}

export function applyCustomTextColors(_theme: ThemeMode, custom: CustomTextColors | null) {
  const root = document.documentElement;
  const keys: TextColorKey[] = ["text", "textSoft", "textMuted"];

  for (const key of keys) {
    const cssVar = TEXT_COLOR_CSS_VARS[key];
    const value = custom?.[key];

    if (value) {
      root.style.setProperty(cssVar, value);
      continue;
    }

    root.style.removeProperty(cssVar);
  }
}
