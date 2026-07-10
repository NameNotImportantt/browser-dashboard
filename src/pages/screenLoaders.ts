import type {ComponentType} from 'react';
import type {SettingsPanel} from '@/components/Settings/SettingsPanel';

export type LazyScreenId = 'todo' | 'habits' | 'notes' | 'settings';

type ScreenModule<TComponent extends ComponentType> = {
  default: TComponent;
};

type ScreenLoader<TComponent extends ComponentType = ComponentType> = () => Promise<ScreenModule<TComponent>>;

interface NavigatorConnection {
  effectiveType?: string;
  saveData?: boolean;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NavigatorConnection;
}

function createCachedLoader<TComponent extends ComponentType>(
    load: ScreenLoader<TComponent>,
): ScreenLoader<TComponent> {
    let cachedPromise: ReturnType<ScreenLoader<TComponent>> | null = null;

    return () => {
        if (cachedPromise) {
            return cachedPromise;
        }

        const loadPromise = load();

        cachedPromise = loadPromise;

        void loadPromise.catch(() => {
            if (cachedPromise === loadPromise) {
                cachedPromise = null;
            }
        });

        return loadPromise;
    };
}

type SettingsPanelComponent = typeof SettingsPanel;

const settingsLoader = createCachedLoader<SettingsPanelComponent>(
    () => import('@/components/Settings/SettingsPanel').then(({SettingsPanel}) => ({default: SettingsPanel})),
);

export const screenLoaders = {
    todo: createCachedLoader(() => import('@/components/Todo/TodoWidget').then(({TodoWidget}) => ({default: TodoWidget}))),
    habits: createCachedLoader(() => import('@/components/Habits/HabitsWidget').then(({HabitsWidget}) => ({default: HabitsWidget}))),
    notes: createCachedLoader(() => import('@/components/Notes/NotesWidget').then(({NotesWidget}) => ({default: NotesWidget}))),
    settings: settingsLoader,
} satisfies Record<LazyScreenId, ScreenLoader>;

type ScreenLoadPromise = ReturnType<ScreenLoader>;

const prefetchPromises = new Map<LazyScreenId, ScreenLoadPromise>();

export function canPrefetchScreen() {
    if (typeof navigator === 'undefined') {
        return false;
    }

    const connection = (navigator as NavigatorWithConnection).connection;

    return connection?.saveData !== true
        && connection?.effectiveType !== '2g'
        && connection?.effectiveType !== 'slow-2g';
}

export function preloadScreen(screenId: LazyScreenId) {
    const existingPromise = prefetchPromises.get(screenId);

    if (existingPromise) {
        return existingPromise;
    }

    const loadPromise = screenLoaders[screenId]();

    prefetchPromises.set(screenId, loadPromise);

    return loadPromise;
}
