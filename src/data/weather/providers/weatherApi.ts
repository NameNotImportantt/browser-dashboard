import {WEATHER_FETCH_TIMEOUT_MS} from '../constants';
import type {WeatherLocation} from '@/db';

function mapWeatherApiCodeToWmo(conditionCode: number) {
    switch (conditionCode) {
        case 1000:
            return 0;
        case 1003:
            return 2;
        case 1006:
        case 1009:
            return 3;
        case 1030:
        case 1135:
            return 45;
        case 1066:
        case 1069:
        case 1114:
        case 1117:
        case 1210:
        case 1213:
        case 1216:
        case 1219:
        case 1222:
        case 1225:
        case 1255:
        case 1258:
        case 1279:
        case 1282:
            return 73;
        case 1063:
        case 1072:
        case 1150:
        case 1153:
        case 1168:
        case 1171:
        case 1180:
        case 1183:
        case 1186:
        case 1189:
        case 1192:
        case 1195:
        case 1198:
        case 1201:
        case 1204:
        case 1207:
        case 1240:
        case 1243:
        case 1246:
        case 1249:
        case 1252:
        case 1261:
        case 1264:
            return 63;
        case 1087:
        case 1273:
        case 1276:
            return 95;
        case 1147:
            return 48;
        default:
            return 3;
    }
}

function createTimeoutController() {
    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => abortController.abort(), WEATHER_FETCH_TIMEOUT_MS);

    return {
        abortController,
        timeoutId,
    };
}

export async function lookupWeatherApiCity(city: string, apiKey: string) {
    const query = new URLSearchParams({
        key: apiKey,
        q: city.trim(),
    });

    const {abortController, timeoutId} = createTimeoutController();

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?${query.toString()}`, {
            signal: abortController.signal,
        });

        if (!response.ok) {
            throw new Error('Не удалось найти город');
        }

        const data = (await response.json()) as Array<{
            name?: string;
            region?: string;
            country?: string;
            lat?: number;
            lon?: number;
        }>;

        const result = data[0];

        if (
            !result ||
            typeof result.name !== 'string' ||
            typeof result.lat !== 'number' ||
            typeof result.lon !== 'number'
        ) {
            throw new Error('Город не найден');
        }

        const labelParts = [result.name, result.region, result.country].filter(Boolean);

        return {
            lat: Number(result.lat.toFixed(4)),
            lon: Number(result.lon.toFixed(4)),
            label: labelParts.join(', '),
        };
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Сервис погоды не ответил вовремя');
        }

        throw error;
    } finally {
        window.clearTimeout(timeoutId);
    }
}

export async function fetchWeatherApiCurrentWeather(location: WeatherLocation, apiKey: string) {
    const query = new URLSearchParams({
        key: apiKey,
        q: `${location.lat},${location.lon}`,
        aqi: 'no',
    });

    const {abortController, timeoutId} = createTimeoutController();

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?${query.toString()}`, {
            signal: abortController.signal,
        });

        if (!response.ok) {
            throw new Error('Не удалось получить данные погоды');
        }

        const data = (await response.json()) as {
            current?: {
                temp_c?: number;
                condition?: {
                    code?: number;
                };
            };
        };

        const temperatureC = data.current?.temp_c;
        const conditionCode = data.current?.condition?.code;

        if (typeof temperatureC !== 'number' || typeof conditionCode !== 'number') {
            throw new Error('Сервис погоды вернул неполные данные');
        }

        return {
            temperatureC,
            weatherCode: mapWeatherApiCodeToWmo(conditionCode),
        };
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new Error('Сервис погоды не ответил вовремя');
        }

        throw error;
    } finally {
        window.clearTimeout(timeoutId);
    }
}
