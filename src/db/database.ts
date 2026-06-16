import Dexie, { type Table } from "dexie";
import type { Bookmark } from "@/db/types/bookmark";
import type { BookmarkCategory } from "@/db/types/bookmarkCategory";
import type { Habit } from "@/db/types/habit";
import type { Note } from "@/db/types/note";
import type { AppSettings } from "@/db/types/settings";
import type { TodoItem } from "@/db/types/todo";
import type { WeatherCache } from "@/db/types/weather";
import type { Workspace } from "@/db/types/workspace";

export class DashboardDatabase extends Dexie {
  workspaces!: Table<Workspace, string>;
  todos!: Table<TodoItem, string>;
  notes!: Table<Note, string>;
  habits!: Table<Habit, string>;
  bookmarks!: Table<Bookmark, string>;
  bookmarkCategories!: Table<BookmarkCategory, string>;
  settings!: Table<AppSettings, string>;
  weatherCache!: Table<WeatherCache, string>;

  constructor() {
    super("browser-home-page-db");

    this.version(1).stores({
      workspaces: "id,position,createdAt",
      todos: "id,workspaceId,completed,priority,dueDate,position,updatedAt",
      notes: "id,workspaceId,updatedAt",
      habits: "id,workspaceId,position,createdAt",
      bookmarks: "id,workspaceId,position,createdAt",
      settings: "key,updatedAt",
      weatherCache: "id,fetchedAt",
    });

    this.version(2)
      .stores({
        workspaces: "id,position,createdAt",
        todos: "id,workspaceId,completed,priority,dueDate,position,updatedAt",
        notes: "id,workspaceId,updatedAt",
        habits: "id,workspaceId,position,createdAt",
        bookmarks: "id,workspaceId,position,createdAt",
        settings: "key,updatedAt",
        weatherCache: "id,fetchedAt",
      })
      .upgrade(async transaction => {
        await transaction
          .table("settings")
          .toCollection()
          .modify((settings: Record<string, unknown>) => {
            const legacySearchEngine = settings.searchEngine as string | undefined;

            settings.activeSearchEngineId = settings.activeSearchEngineId ?? legacySearchEngine ?? "duckduckgo";
            settings.customSearchEngines = settings.customSearchEngines ?? [];
            settings.timeFormat = settings.timeFormat ?? "24h";
            settings.timezone = settings.timezone ?? "auto";
            settings.locale = settings.locale ?? "ru";
            settings.dateFormat = settings.dateFormat ?? "dd.MM.yyyy";
            settings.tabTitle = settings.tabTitle ?? "Personal Dashboard";

            delete settings.searchEngine;
          });
      });

    this.version(3)
      .stores({
        workspaces: "id,position,createdAt",
        todos: "id,workspaceId,completed,priority,dueDate,position,updatedAt",
        notes: "id,workspaceId,updatedAt",
        habits: "id,workspaceId,position,createdAt",
        bookmarks: "id,workspaceId,categoryId,position,createdAt",
        bookmarkCategories: "id,workspaceId,position,createdAt",
        settings: "key,updatedAt",
        weatherCache: "id,fetchedAt",
      })
      .upgrade(async transaction => {
        await transaction
          .table("bookmarks")
          .toCollection()
          .modify((bookmark: Record<string, unknown>) => {
            bookmark.categoryId = bookmark.categoryId ?? null;
          });
      });
  }
}

export const db = new DashboardDatabase();
