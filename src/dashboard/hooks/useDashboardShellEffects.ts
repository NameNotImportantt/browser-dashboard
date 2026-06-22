import {useEffect} from 'react';
import {DEFAULT_TAB_TITLE, WEATHER_CACHE_TTL_MS} from '@/app';
import {applyCustomTextColors} from '@/app/themeTextColors';
import {useDashboardCore} from './useDashboardCore';
import {useSettings} from './useSettings';
import {useWeather} from './useWeather';

export function useDashboardShellEffects() {
    const {loading} = useDashboardCore();
    const {settings} = useSettings();
    const {weather, refreshWeather} = useWeather();

    useEffect(() => {
        document.documentElement.dataset.theme = settings.theme;
    }, [settings.theme]);

    useEffect(() => {
        applyCustomTextColors(settings.theme, settings.customTextColors);
    }, [settings.theme, settings.customTextColors]);

    useEffect(() => {
        const root = document.documentElement;

        if (settings.customBackgroundImage) {
            root.dataset.customBg = 'true';
            root.style.setProperty('--app-bg-image', `url("${settings.customBackgroundImage}")`);
            root.style.setProperty('--bg-scrim-opacity', String(settings.backgroundScrimOpacity / 100));
            return;
        }

        delete root.dataset.customBg;
        root.style.removeProperty('--app-bg-image');
        root.style.removeProperty('--bg-scrim-opacity');
    }, [settings.customBackgroundImage, settings.backgroundScrimOpacity]);

    useEffect(() => {
        document.documentElement.lang = settings.locale;
    }, [settings.locale]);

    useEffect(() => {
        document.title = settings.tabTitle.trim() || DEFAULT_TAB_TITLE;
    }, [settings.tabTitle]);

    useEffect(() => {
        if (loading) {return;}

        const cacheIsFresh = weather ? Date.now() - weather.fetchedAt < WEATHER_CACHE_TTL_MS : false;

        if (cacheIsFresh) {return;}

        void refreshWeather(false).catch(() => undefined);
    }, [loading, refreshWeather, weather]);
}
