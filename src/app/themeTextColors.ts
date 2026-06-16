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

export const TEXT_COLOR_SWATCHES: Record<ThemeMode, Record<TextColorKey, string[]>> = {
  dark: {
    text: ["#e7ecff", "#ffffff", "#d8deff", "#c4b5fd", "#b8c8e8"],
    textSoft: ["#aab3c7", "#98a5be", "#8b98b2", "#b0bdd4", "#7f8ea8"],
    textMuted: ["#6f7a90", "#5a6578", "#8491a6", "#586274", "#9aa5b8"],
  },
  light: {
    text: ["#1d2433", "#0f141f", "#2a3347", "#3d4660", "#1a1f2e"],
    textSoft: ["#4f5d78", "#3d4a63", "#62708a", "#566580", "#6b7a94"],
    textMuted: ["#6f7a90", "#5c6778", "#8290a6", "#6a7589", "#8a96ab"],
  },
};

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
