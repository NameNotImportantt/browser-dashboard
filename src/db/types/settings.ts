import type { WeatherLocation } from "@/db/types/weather";

export type ThemeMode = "light" | "dark";

export type SearchEngine = "google" | "duckduckgo";

export interface AppSettings {
  key: "app";
  theme: ThemeMode;
  searchEngine: SearchEngine;
  lastWorkspaceId: string | null;
  weatherLocation: WeatherLocation | null;
  updatedAt: number;
}
