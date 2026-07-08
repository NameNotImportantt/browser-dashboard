import * as repository from '@/data/weather/weatherService';
import {createSnapshotFieldReload} from '../lib/createSnapshotFieldReload';
import {persistHomeBootstrapCache} from '../lib/persistHomeBootstrapCache';
import {replaceSnapshotField} from '../lib/snapshotMutations';
import type {SliceCreator, WeatherSlice} from '../types';

export const createWeatherSlice: SliceCreator<WeatherSlice> = (set, get) => {
    const reloadWeatherCache = createSnapshotFieldReload(set, 'weatherCache', repository.getWeatherCache);

    return {
        refreshWeather: async (force = false) => {
            const weatherCache = await repository.refreshWeather(force);

            replaceSnapshotField(set, 'weatherCache', weatherCache);
            await persistHomeBootstrapCache(get);
        },
        setWeatherCity: async city => {
            const settings = await repository.setWeatherCity(city);

            replaceSnapshotField(set, 'settings', settings);

            if (!city.trim()) {
                replaceSnapshotField(set, 'weatherCache', null);
                await persistHomeBootstrapCache(get);
                return;
            }

            const weatherCache = await repository.refreshWeather(true);

            replaceSnapshotField(set, 'weatherCache', weatherCache);
            await persistHomeBootstrapCache(get);
            await reloadWeatherCache();
        },
    };
};
