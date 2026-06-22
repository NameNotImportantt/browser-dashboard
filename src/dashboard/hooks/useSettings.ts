import {useShallow} from 'zustand/react/shallow';
import {DEFAULT_SETTINGS} from '@/app';
import {useDashboardStore} from '@/store';

export function useSettings() {
    const settings = useDashboardStore(dashboardStore => dashboardStore.snapshot?.settings ?? DEFAULT_SETTINGS);

    const actions = useDashboardStore(
        useShallow(dashboardStore => ({
            setTheme: dashboardStore.setTheme,
            setActiveSearchEngineId: dashboardStore.setActiveSearchEngineId,
            setSearchHistoryEnabled: dashboardStore.setSearchHistoryEnabled,
            setTimeFormat: dashboardStore.setTimeFormat,
            setTimezone: dashboardStore.setTimezone,
            setLocale: dashboardStore.setLocale,
            setDateFormat: dashboardStore.setDateFormat,
            setTabTitle: dashboardStore.setTabTitle,
            setBackgroundImageFromFile: dashboardStore.setBackgroundImageFromFile,
            clearBackgroundImage: dashboardStore.clearBackgroundImage,
            setBackgroundScrimOpacity: dashboardStore.setBackgroundScrimOpacity,
            setTextColor: dashboardStore.setTextColor,
            resetTextColors: dashboardStore.resetTextColors,
            addCustomSearchEngine: dashboardStore.addCustomSearchEngine,
            removeCustomSearchEngine: dashboardStore.removeCustomSearchEngine,
        })),
    );

    return {
        settings,
        locale: settings.locale,
        ...actions,
    };
}
