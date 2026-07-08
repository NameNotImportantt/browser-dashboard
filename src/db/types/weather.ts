import type {WeatherProvider} from './weatherProvider';

export interface WeatherLocation {
  lat: number;
  lon: number;
  label: string;
  provider: WeatherProvider;
}

export interface WeatherCache {
  id: 'current';
  provider: WeatherProvider;
  locationLabel: string;
  temperatureC: number;
  weatherCode: number;
  fetchedAt: number;
}
