import {useShallow} from 'zustand/react/shallow';
import {useDashboardStore} from '@/store';

export function useWeather() {
    const weather = useDashboardStore(dashboardStore => dashboardStore.snapshot?.weatherCache ?? null);

    const actions = useDashboardStore(
        useShallow(dashboardStore => ({
            refreshWeather: dashboardStore.refreshWeather,
            setWeatherCity: dashboardStore.setWeatherCity,
        })),
    );

    return {weather, ...actions};
}
