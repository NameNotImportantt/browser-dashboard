export interface WeatherLocation {
  lat: number;
  lon: number;
  label: string;
}

export interface WeatherCache {
  id: "current";
  locationLabel: string;
  temperatureC: number;
  weatherCode: number;
  fetchedAt: number;
}
