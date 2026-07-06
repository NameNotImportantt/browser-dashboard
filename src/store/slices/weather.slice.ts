import * as repository from '@/data/weather/weatherService';
import {createSnapshotFieldReload} from '../lib/createSnapshotFieldReload';
import {replaceSnapshotField} from '../lib/snapshotMutations';
import type {SliceCreator, WeatherSlice} from '../types';

export const createWeatherSlice: SliceCreator<WeatherSlice> = (set, get) => {
    const reloadWeatherCache = createSnapshotFieldReload(set, 'weatherCache', repository.getWeatherCache);

    return {
        refreshWeather: async (force = false) => {
            const weatherCache = await repository.refreshWeather(force);

            replaceSnapshotField(set, 'weatherCache', weatherCache);
        },
        setWeatherCity: async city => {
            const settings = await repository.setWeatherCity(city);

            replaceSnapshotField(set, 'settings', settings);

            if (!city.trim()) {
                replaceSnapshotField(set, 'weatherCache', null);
                return;
            }

            void repository.refreshWeather(true)
                .then(async weatherCache => {
                    replaceSnapshotField(set, 'weatherCache', weatherCache);
                    await reloadWeatherCache();
                })
                .catch(() => undefined);
        },
    };
};
