import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/db/database";
import { createId, normalizeUrl, todayKey, WEATHER_CACHE_TTL_MS } from "@/app/utils";
import type { Bookmark, CreateBookmarkPayload } from "@/db/types/bookmark";
import type { Habit } from "@/db/types/habit";
import type { Note } from "@/db/types/note";
import type { AppSettings, SearchEngine, ThemeMode } from "@/db/types/settings";
import type { CreateTodoPayload, TodoItem } from "@/db/types/todo";
import type { WeatherCache, WeatherLocation } from "@/db/types/weather";
import type { Workspace } from "@/db/types/workspace";

const DEFAULT_SETTINGS: AppSettings = {
  key: "app",
  theme: "dark",
  searchEngine: "duckduckgo",
  lastWorkspaceId: null,
  weatherLocation: null,
  updatedAt: Date.now(),
};

interface Snapshot {
  workspaces: Workspace[];
  todos: TodoItem[];
  habits: Habit[];
  bookmarks: Bookmark[];
  notes: Note[];
  settings: AppSettings;
  weatherCache: WeatherCache | null;
}

function sortByPosition<T extends { position: number }>(items: T[]) {
  return [...items].sort((a, b) => a.position - b.position);
}

async function ensureSeedData() {
  const workspacesCount = await db.workspaces.count();
  let firstWorkspaceId: string | null = null;

  if (workspacesCount === 0) {
    const id = createId();
    const now = Date.now();
    await db.workspaces.add({
      id,
      name: "Личное",
      position: 0,
      createdAt: now,
    });
    firstWorkspaceId = id;
  }

  const currentSettings = await db.settings.get("app");
  if (!currentSettings) {
    await db.settings.put({
      ...DEFAULT_SETTINGS,
      lastWorkspaceId: firstWorkspaceId,
      updatedAt: Date.now(),
    });
  }
}

async function loadSnapshot(): Promise<Snapshot> {
  const [workspaces, todos, habits, bookmarks, notes, settings, weatherCache] = await Promise.all([
    db.workspaces.toArray(),
    db.todos.toArray(),
    db.habits.toArray(),
    db.bookmarks.toArray(),
    db.notes.toArray(),
    db.settings.get("app"),
    db.weatherCache.get("current"),
  ]);

  return {
    workspaces: sortByPosition(workspaces),
    todos: sortByPosition(todos),
    habits: sortByPosition(habits),
    bookmarks: sortByPosition(bookmarks),
    notes,
    settings: settings ?? DEFAULT_SETTINGS,
    weatherCache: weatherCache ?? null,
  };
}

async function detectLocation(): Promise<WeatherLocation | null> {
  if (!navigator.geolocation) {
    return null;
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 6000,
        maximumAge: 30 * 60 * 1000,
      });
    });

    const lat = Number(position.coords.latitude.toFixed(4));
    const lon = Number(position.coords.longitude.toFixed(4));
    return {
      lat,
      lon,
      label: "Текущая геопозиция",
    };
  } catch {
    return null;
  }
}

export function useDashboardData() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const nextSnapshot = await loadSnapshot();
    const hasActiveWorkspace = nextSnapshot.workspaces.some(item => item.id === activeWorkspaceId);
    const preferredId = nextSnapshot.settings.lastWorkspaceId;
    const hasPreferred = nextSnapshot.workspaces.some(item => item.id === preferredId);

    const nextActiveWorkspaceId = hasPreferred
      ? preferredId
      : hasActiveWorkspace
        ? activeWorkspaceId
        : (nextSnapshot.workspaces[0]?.id ?? null);

    setSnapshot(nextSnapshot);
    setActiveWorkspaceId(nextActiveWorkspaceId);
  }, [activeWorkspaceId]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);
        await ensureSeedData();
        if (mounted) {
          await refresh();
        }
      } catch (unknownError) {
        if (mounted) {
          setError(unknownError instanceof Error ? unknownError.message : "Не удалось инициализировать данные");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      mounted = false;
    };
  }, [refresh]);

  const settings = snapshot?.settings ?? DEFAULT_SETTINGS;
  const workspaces = snapshot?.workspaces ?? [];
  const todos = snapshot?.todos ?? [];
  const habits = snapshot?.habits ?? [];
  const bookmarks = snapshot?.bookmarks ?? [];
  const notes = snapshot?.notes ?? [];
  const weatherCache = snapshot?.weatherCache ?? null;

  const activeWorkspace = useMemo(() => {
    return workspaces.find(item => item.id === activeWorkspaceId) ?? null;
  }, [activeWorkspaceId, workspaces]);

  const workspaceTodos = useMemo(() => {
    if (!activeWorkspaceId) return [];
    const filtered = todos.filter(item => item.workspaceId === activeWorkspaceId);
    return [...filtered].sort((a, b) => {
      if (a.completed !== b.completed) {
        return Number(a.completed) - Number(b.completed);
      }
      return a.position - b.position;
    });
  }, [activeWorkspaceId, todos]);

  const workspaceHabits = useMemo(() => {
    if (!activeWorkspaceId) return [];
    return habits.filter(item => item.workspaceId === activeWorkspaceId);
  }, [activeWorkspaceId, habits]);

  const workspaceBookmarks = useMemo(() => {
    if (!activeWorkspaceId) return [];
    return bookmarks.filter(item => item.workspaceId === activeWorkspaceId);
  }, [activeWorkspaceId, bookmarks]);

  const workspaceNoteText = useMemo(() => {
    if (!activeWorkspaceId) return "";

    const workspaceNotes = notes.filter(item => item.workspaceId === activeWorkspaceId);
    if (workspaceNotes.length === 0) return "";

    return workspaceNotes.sort((a, b) => b.updatedAt - a.updatedAt)[0]?.text ?? "";
  }, [activeWorkspaceId, notes]);

  const selectWorkspace = useCallback(
    async (workspaceId: string) => {
      const currentSettings = (await db.settings.get("app")) ?? DEFAULT_SETTINGS;
      await db.settings.put({
        ...currentSettings,
        lastWorkspaceId: workspaceId,
        updatedAt: Date.now(),
      });
      await refresh();
    },
    [refresh],
  );

  const addWorkspace = useCallback(
    async (name: string) => {
      const value = name.trim();
      if (!value) return;

      const id = createId();
      const now = Date.now();
      const position = workspaces.length;

      await db.workspaces.add({
        id,
        name: value,
        position,
        createdAt: now,
      });

      const currentSettings = (await db.settings.get("app")) ?? DEFAULT_SETTINGS;
      await db.settings.put({
        ...currentSettings,
        lastWorkspaceId: id,
        updatedAt: now,
      });

      await refresh();
    },
    [refresh, workspaces.length],
  );

  const deleteWorkspace = useCallback(
    async (workspaceId: string) => {
      if (workspaces.length <= 1) return;
      if (!workspaces.some(item => item.id === workspaceId)) return;

      const remaining = workspaces.filter(item => item.id !== workspaceId);
      const currentSettings = (await db.settings.get("app")) ?? DEFAULT_SETTINGS;
      const isDeletingActive = currentSettings.lastWorkspaceId === workspaceId;

      await db.transaction("rw", [db.workspaces, db.todos, db.habits, db.bookmarks, db.notes, db.settings], async () => {
        await Promise.all([
          db.todos.where("workspaceId").equals(workspaceId).delete(),
          db.habits.where("workspaceId").equals(workspaceId).delete(),
          db.bookmarks.where("workspaceId").equals(workspaceId).delete(),
          db.notes.where("workspaceId").equals(workspaceId).delete(),
          db.workspaces.delete(workspaceId),
        ]);

        if (isDeletingActive) {
          await db.settings.put({
            ...currentSettings,
            lastWorkspaceId: remaining[0]?.id ?? null,
            updatedAt: Date.now(),
          });
        }
      });

      await refresh();
    },
    [refresh, workspaces],
  );

  const setTheme = useCallback(
    async (theme: ThemeMode) => {
      const currentSettings = (await db.settings.get("app")) ?? DEFAULT_SETTINGS;
      await db.settings.put({
        ...currentSettings,
        theme,
        updatedAt: Date.now(),
      });
      await refresh();
    },
    [refresh],
  );

  const setSearchEngine = useCallback(
    async (searchEngine: SearchEngine) => {
      const currentSettings = (await db.settings.get("app")) ?? DEFAULT_SETTINGS;
      await db.settings.put({
        ...currentSettings,
        searchEngine,
        updatedAt: Date.now(),
      });
      await refresh();
    },
    [refresh],
  );

  const addTodo = useCallback(
    async (payload: CreateTodoPayload) => {
      if (!activeWorkspaceId) return;

      const title = payload.title.trim();
      if (!title) return;

      const now = Date.now();
      const position = workspaceTodos.length;
      await db.todos.add({
        id: createId(),
        workspaceId: activeWorkspaceId,
        title,
        completed: false,
        priority: payload.priority,
        dueDate: payload.dueDate,
        position,
        createdAt: now,
        updatedAt: now,
      });
      await refresh();
    },
    [activeWorkspaceId, refresh, workspaceTodos.length],
  );

  const toggleTodo = useCallback(
    async (todoId: string) => {
      const item = await db.todos.get(todoId);
      if (!item) return;
      await db.todos.update(todoId, {
        completed: !item.completed,
        updatedAt: Date.now(),
      });
      await refresh();
    },
    [refresh],
  );

  const deleteTodo = useCallback(
    async (todoId: string) => {
      await db.todos.delete(todoId);
      await refresh();
    },
    [refresh],
  );

  const reorderTodos = useCallback(
    async (orderedIds: string[]) => {
      const updates = orderedIds.map((id, index) => ({
        key: id,
        changes: {
          position: index,
          updatedAt: Date.now(),
        },
      }));
      await Promise.all(updates.map(item => db.todos.update(item.key, item.changes)));
      await refresh();
    },
    [refresh],
  );

  const addHabit = useCallback(
    async (title: string) => {
      if (!activeWorkspaceId) return;
      const value = title.trim();
      if (!value) return;

      await db.habits.add({
        id: createId(),
        workspaceId: activeWorkspaceId,
        title: value,
        completionDates: [],
        position: workspaceHabits.length,
        createdAt: Date.now(),
      });
      await refresh();
    },
    [activeWorkspaceId, refresh, workspaceHabits.length],
  );

  const toggleHabitToday = useCallback(
    async (habitId: string) => {
      const habit = await db.habits.get(habitId);
      if (!habit) return;

      const key = todayKey();
      const hasCompleted = habit.completionDates.includes(key);
      const completionDates = hasCompleted
        ? habit.completionDates.filter(item => item !== key)
        : [...habit.completionDates, key].sort();

      await db.habits.update(habitId, { completionDates });
      await refresh();
    },
    [refresh],
  );

  const deleteHabit = useCallback(
    async (habitId: string) => {
      await db.habits.delete(habitId);
      await refresh();
    },
    [refresh],
  );

  const addBookmark = useCallback(
    async (payload: CreateBookmarkPayload) => {
      if (!activeWorkspaceId) return;

      const title = payload.title.trim();
      const url = payload.url.trim();
      if (!title || !url) return;

      await db.bookmarks.add({
        id: createId(),
        workspaceId: activeWorkspaceId,
        title,
        url: normalizeUrl(url),
        position: workspaceBookmarks.length,
        createdAt: Date.now(),
      });
      await refresh();
    },
    [activeWorkspaceId, refresh, workspaceBookmarks.length],
  );

  const deleteBookmark = useCallback(
    async (bookmarkId: string) => {
      await db.bookmarks.delete(bookmarkId);
      await refresh();
    },
    [refresh],
  );

  const saveNote = useCallback(
    async (text: string) => {
      if (!activeWorkspaceId) return;

      const now = Date.now();
      const existing = await db.notes.where("workspaceId").equals(activeWorkspaceId).first();

      if (existing) {
        await db.notes.update(existing.id, {
          text,
          updatedAt: now,
        });
      } else {
        await db.notes.add({
          id: createId(),
          workspaceId: activeWorkspaceId,
          text,
          updatedAt: now,
        });
      }

      await refresh();
    },
    [activeWorkspaceId, refresh],
  );

  const refreshWeather = useCallback(
    async (force = false) => {
      const currentSettings = (await db.settings.get("app")) ?? DEFAULT_SETTINGS;
      const cache = await db.weatherCache.get("current");
      const cacheIsFresh = cache ? Date.now() - cache.fetchedAt < WEATHER_CACHE_TTL_MS : false;

      if (!force && cacheIsFresh) {
        await refresh();
        return;
      }

      const location = currentSettings.weatherLocation ?? (await detectLocation());
      if (!location) {
        await db.weatherCache.delete("current");
        await refresh();
        return;
      }

      const query = new URLSearchParams({
        latitude: String(location.lat),
        longitude: String(location.lon),
        current: "temperature_2m,weather_code",
      });

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query.toString()}`);
      if (!response.ok) {
        throw new Error("Не удалось получить данные погоды");
      }

      const data = (await response.json()) as {
        current?: {
          temperature_2m?: number;
          weather_code?: number;
        };
      };

      const temperatureC = data.current?.temperature_2m;
      const weatherCode = data.current?.weather_code;
      if (typeof temperatureC !== "number" || typeof weatherCode !== "number") {
        throw new Error("Сервис погоды вернул неполные данные");
      }

      const now = Date.now();
      await db.weatherCache.put({
        id: "current",
        locationLabel: location.label,
        temperatureC,
        weatherCode,
        fetchedAt: now,
      });

      await db.settings.put({
        ...currentSettings,
        weatherLocation: location,
        updatedAt: now,
      });

      await refresh();
    },
    [refresh],
  );

  const actions = useMemo(
    () => ({
      refresh,
      selectWorkspace,
      addWorkspace,
      deleteWorkspace,
      setTheme,
      setSearchEngine,
      addTodo,
      toggleTodo,
      deleteTodo,
      reorderTodos,
      addHabit,
      toggleHabitToday,
      deleteHabit,
      addBookmark,
      deleteBookmark,
      saveNote,
      refreshWeather,
    }),
    [
      refresh,
      selectWorkspace,
      addWorkspace,
      deleteWorkspace,
      setTheme,
      setSearchEngine,
      addTodo,
      toggleTodo,
      deleteTodo,
      reorderTodos,
      addHabit,
      toggleHabitToday,
      deleteHabit,
      addBookmark,
      deleteBookmark,
      saveNote,
      refreshWeather,
    ],
  );

  return {
    loading,
    error,
    workspaces,
    todos: workspaceTodos,
    habits: workspaceHabits,
    bookmarks: workspaceBookmarks,
    noteText: workspaceNoteText,
    settings,
    weatherCache,
    activeWorkspaceId,
    activeWorkspace,
    pendingTodos: workspaceTodos.filter(item => !item.completed),
    actions,
  };
}
