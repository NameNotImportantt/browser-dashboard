import { useCallback, useEffect, useMemo, useState } from "react";
import { prepareBackgroundImageDataUrl } from "@/app/backgroundImage";
import { DEFAULT_SETTINGS, geocodeCity, mergeSettings } from "@/app/settingsDefaults";
import { isValidSearchUrlTemplate } from "@/app/searchUtils";
import { createId, normalizeUrl, todayKey, WEATHER_CACHE_TTL_MS } from "@/app/utils";
import { db } from "@/db/database";
import type { Bookmark, CreateBookmarkPayload } from "@/db/types/bookmark";
import type { BookmarkCategory, CreateBookmarkCategoryPayload } from "@/db/types/bookmarkCategory";
import type { Habit } from "@/db/types/habit";
import type { Note } from "@/db/types/note";
import type { AppLocale, AppSettings, CustomSearchEngine, CustomTextColors, DateFormatPreset, TextColorKey, ThemeMode, TimeFormat } from "@/db/types/settings";
import type { CreateTodoPayload, TodoItem } from "@/db/types/todo";
import type { WeatherCache } from "@/db/types/weather";
import type { Workspace } from "@/db/types/workspace";

interface Snapshot {
  workspaces: Workspace[];
  todos: TodoItem[];
  habits: Habit[];
  bookmarks: Bookmark[];
  bookmarkCategories: BookmarkCategory[];
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
      name: "main",
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
  const [workspaces, todos, habits, bookmarks, bookmarkCategories, notes, settings, weatherCache] = await Promise.all([
    db.workspaces.toArray(),
    db.todos.toArray(),
    db.habits.toArray(),
    db.bookmarks.toArray(),
    db.bookmarkCategories.toArray(),
    db.notes.toArray(),
    db.settings.get("app"),
    db.weatherCache.get("current"),
  ]);

  return {
    workspaces: sortByPosition(workspaces),
    todos: sortByPosition(todos),
    habits: sortByPosition(habits),
    bookmarks: sortByPosition(bookmarks),
    bookmarkCategories: sortByPosition(bookmarkCategories),
    notes,
    settings: mergeSettings(settings),
    weatherCache: weatherCache ?? null,
  };
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

  const patchSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      const currentSettings = mergeSettings(await db.settings.get("app"));
      await db.settings.put({
        ...currentSettings,
        ...patch,
        updatedAt: Date.now(),
      });
      await refresh();
    },
    [refresh],
  );

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
  const bookmarkCategories = snapshot?.bookmarkCategories ?? [];
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
    return sortByPosition(habits.filter(item => item.workspaceId === activeWorkspaceId));
  }, [activeWorkspaceId, habits]);

  const workspaceBookmarks = useMemo(() => {
    if (!activeWorkspaceId) return [];
    return sortByPosition(bookmarks.filter(item => item.workspaceId === activeWorkspaceId));
  }, [activeWorkspaceId, bookmarks]);

  const workspaceBookmarkCategories = useMemo(() => {
    if (!activeWorkspaceId) return [];
    return sortByPosition(bookmarkCategories.filter(item => item.workspaceId === activeWorkspaceId));
  }, [activeWorkspaceId, bookmarkCategories]);

  const workspaceNoteText = useMemo(() => {
    if (!activeWorkspaceId) return "";

    const workspaceNotes = notes.filter(item => item.workspaceId === activeWorkspaceId);
    if (workspaceNotes.length === 0) return "";

    return workspaceNotes.sort((a, b) => b.updatedAt - a.updatedAt)[0]?.text ?? "";
  }, [activeWorkspaceId, notes]);

  const selectWorkspace = useCallback(
    async (workspaceId: string) => {
      await patchSettings({ lastWorkspaceId: workspaceId });
    },
    [patchSettings],
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

      await patchSettings({ lastWorkspaceId: id });
    },
    [patchSettings, workspaces.length],
  );

  const deleteWorkspace = useCallback(
    async (workspaceId: string) => {
      if (workspaces.length <= 1) return;
      if (!workspaces.some(item => item.id === workspaceId)) return;

      const remaining = workspaces.filter(item => item.id !== workspaceId);
      const currentSettings = mergeSettings(await db.settings.get("app"));
      const isDeletingActive = currentSettings.lastWorkspaceId === workspaceId;

      await db.transaction(
        "rw",
        [db.workspaces, db.todos, db.habits, db.bookmarks, db.bookmarkCategories, db.notes, db.settings],
        async () => {
        await Promise.all([
          db.todos.where("workspaceId").equals(workspaceId).delete(),
          db.habits.where("workspaceId").equals(workspaceId).delete(),
          db.bookmarks.where("workspaceId").equals(workspaceId).delete(),
          db.bookmarkCategories.where("workspaceId").equals(workspaceId).delete(),
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

  const setTheme = useCallback(async (theme: ThemeMode) => patchSettings({ theme }), [patchSettings]);

  const setActiveSearchEngineId = useCallback(
    async (activeSearchEngineId: string) => patchSettings({ activeSearchEngineId }),
    [patchSettings],
  );

  const setTimeFormat = useCallback(async (timeFormat: TimeFormat) => patchSettings({ timeFormat }), [patchSettings]);

  const setTimezone = useCallback(async (timezone: string) => patchSettings({ timezone }), [patchSettings]);

  const setLocale = useCallback(async (locale: AppLocale) => patchSettings({ locale }), [patchSettings]);

  const setDateFormat = useCallback(async (dateFormat: DateFormatPreset) => patchSettings({ dateFormat }), [patchSettings]);

  const setTabTitle = useCallback(async (tabTitle: string) => patchSettings({ tabTitle: tabTitle.trim() || DEFAULT_SETTINGS.tabTitle }), [patchSettings]);

  const setBackgroundImageFromFile = useCallback(
    async (file: File) => {
      const customBackgroundImage = await prepareBackgroundImageDataUrl(file);
      await patchSettings({ customBackgroundImage });
    },
    [patchSettings],
  );

  const clearBackgroundImage = useCallback(async () => patchSettings({ customBackgroundImage: null }), [patchSettings]);

  const setTextColor = useCallback(
    async (key: TextColorKey, value: string | null) => {
      const currentSettings = mergeSettings(await db.settings.get("app"));
      const base: CustomTextColors = currentSettings.customTextColors ?? {
        text: null,
        textSoft: null,
        textMuted: null,
      };

      const nextColors: CustomTextColors = { ...base, [key]: value };
      const hasAnyCustom = nextColors.text || nextColors.textSoft || nextColors.textMuted;

      await patchSettings({
        customTextColors: hasAnyCustom ? nextColors : null,
      });
    },
    [patchSettings],
  );

  const resetTextColors = useCallback(async () => patchSettings({ customTextColors: null }), [patchSettings]);

  const addCustomSearchEngine = useCallback(
    async (payload: { name: string; urlTemplate: string }) => {
      const name = payload.name.trim();
      const urlTemplate = payload.urlTemplate.trim();
      if (!name || !isValidSearchUrlTemplate(urlTemplate)) return;

      const currentSettings = mergeSettings(await db.settings.get("app"));
      const engine: CustomSearchEngine = {
        id: createId(),
        name,
        urlTemplate,
      };

      await patchSettings({
        customSearchEngines: [...currentSettings.customSearchEngines, engine],
        activeSearchEngineId: engine.id,
      });
    },
    [patchSettings],
  );

  const removeCustomSearchEngine = useCallback(
    async (engineId: string) => {
      const currentSettings = mergeSettings(await db.settings.get("app"));
      const customSearchEngines = currentSettings.customSearchEngines.filter(engine => engine.id !== engineId);
      const activeSearchEngineId =
        currentSettings.activeSearchEngineId === engineId ? "duckduckgo" : currentSettings.activeSearchEngineId;

      await patchSettings({ customSearchEngines, activeSearchEngineId });
    },
    [patchSettings],
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

      const categoryId = payload.categoryId ?? null;
      const categoryBookmarks = workspaceBookmarks.filter(item => item.categoryId === categoryId);

      await db.bookmarks.add({
        id: createId(),
        workspaceId: activeWorkspaceId,
        categoryId,
        title,
        url: normalizeUrl(url),
        position: categoryBookmarks.length,
        createdAt: Date.now(),
      });
      await refresh();
    },
    [activeWorkspaceId, refresh, workspaceBookmarks],
  );

  const deleteBookmark = useCallback(
    async (bookmarkId: string) => {
      await db.bookmarks.delete(bookmarkId);
      await refresh();
    },
    [refresh],
  );

  const addBookmarkCategory = useCallback(
    async (payload: CreateBookmarkCategoryPayload) => {
      if (!activeWorkspaceId) return;

      const name = payload.name.trim();
      if (!name) return;

      await db.bookmarkCategories.add({
        id: createId(),
        workspaceId: activeWorkspaceId,
        name,
        position: workspaceBookmarkCategories.length,
        createdAt: Date.now(),
      });
      await refresh();
    },
    [activeWorkspaceId, refresh, workspaceBookmarkCategories.length],
  );

  const deleteBookmarkCategory = useCallback(
    async (categoryId: string) => {
      await db.transaction("rw", [db.bookmarks, db.bookmarkCategories], async () => {
        await db.bookmarks.where("categoryId").equals(categoryId).modify({ categoryId: null });
        await db.bookmarkCategories.delete(categoryId);
      });
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
      const currentSettings = mergeSettings(await db.settings.get("app"));
      const cache = await db.weatherCache.get("current");
      const cacheIsFresh = cache ? Date.now() - cache.fetchedAt < WEATHER_CACHE_TTL_MS : false;

      if (!force && cacheIsFresh) {
        await refresh();
        return;
      }

      const location = currentSettings.weatherLocation;
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

      await refresh();
    },
    [refresh],
  );

  const setWeatherCity = useCallback(
    async (city: string) => {
      const location = await geocodeCity(city);
      await patchSettings({ weatherLocation: location });
      await refreshWeather(true);
    },
    [patchSettings, refreshWeather],
  );

  const actions = useMemo(
    () => ({
      refresh,
      selectWorkspace,
      addWorkspace,
      deleteWorkspace,
      setTheme,
      setActiveSearchEngineId,
      setTimeFormat,
      setTimezone,
      setLocale,
      setDateFormat,
      setTabTitle,
      setBackgroundImageFromFile,
      clearBackgroundImage,
      setTextColor,
      resetTextColors,
      addCustomSearchEngine,
      removeCustomSearchEngine,
      setWeatherCity,
      addTodo,
      toggleTodo,
      deleteTodo,
      reorderTodos,
      addHabit,
      toggleHabitToday,
      deleteHabit,
      addBookmark,
      deleteBookmark,
      addBookmarkCategory,
      deleteBookmarkCategory,
      saveNote,
      refreshWeather,
    }),
    [
      refresh,
      selectWorkspace,
      addWorkspace,
      deleteWorkspace,
      setTheme,
      setActiveSearchEngineId,
      setTimeFormat,
      setTimezone,
      setLocale,
      setDateFormat,
      setTabTitle,
      setBackgroundImageFromFile,
      clearBackgroundImage,
      setTextColor,
      resetTextColors,
      addCustomSearchEngine,
      removeCustomSearchEngine,
      setWeatherCity,
      addTodo,
      toggleTodo,
      deleteTodo,
      reorderTodos,
      addHabit,
      toggleHabitToday,
      deleteHabit,
      addBookmark,
      deleteBookmark,
      addBookmarkCategory,
      deleteBookmarkCategory,
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
    bookmarkCategories: workspaceBookmarkCategories,
    noteText: workspaceNoteText,
    settings,
    weatherCache,
    activeWorkspaceId,
    activeWorkspace,
    pendingTodos: workspaceTodos.filter(item => !item.completed),
    actions,
  };
}
