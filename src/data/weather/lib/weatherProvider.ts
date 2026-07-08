import {WeatherProvider} from '@/db';

export function isWeatherProvider(value: string | null | undefined): value is WeatherProvider {
    return value === WeatherProvider.OpenMeteo || value === WeatherProvider.WeatherApi;
}

export function normalizeWeatherProvider(value: string | null | undefined) {
    return isWeatherProvider(value) ? value : WeatherProvider.OpenMeteo;
}
