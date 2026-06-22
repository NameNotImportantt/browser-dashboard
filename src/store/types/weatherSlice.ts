export interface WeatherSlice {
  refreshWeather: (force?: boolean) => Promise<void>;
  setWeatherCity: (city: string) => Promise<void>;
}
