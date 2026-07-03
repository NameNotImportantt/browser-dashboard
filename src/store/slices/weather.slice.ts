import * as repository from '@/data/weather/weatherService';
import type {SliceCreator, WeatherSlice} from '../types';

export const createWeatherSlice: SliceCreator<WeatherSlice> = (_set, get) => ({
    refreshWeather: async (force = false) => {
        await repository.refreshWeather(force);
        await get().refresh();
    },
    setWeatherCity: async city => {
        await repository.setWeatherCity(city);
        await get().refresh();
    },
});
