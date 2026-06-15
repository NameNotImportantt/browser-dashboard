import Dexie, { type Table } from "dexie";
import type { Bookmark } from "@/db/types/bookmark";
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
  }
}

export const db = new DashboardDatabase();
