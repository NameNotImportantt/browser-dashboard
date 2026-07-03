export async function geocodeCity(city: string) {
    const query = new URLSearchParams({
        name: city.trim(),
        count: '1',
        language: 'ru',
        format: 'json',
    });

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${query.toString()}`);

    if (!response.ok) {
        throw new Error('Не удалось найти город');
    }

    const data = (await response.json()) as {
        results?: Array<{
            name: string;
            latitude: number;
            longitude: number;
            country?: string;
            admin1?: string;
        }>;
    };

    const result = data.results?.[0];

    if (!result) {
        throw new Error('Город не найден');
    }

    const labelParts = [result.name, result.admin1, result.country].filter(Boolean);

    return {
        lat: Number(result.latitude.toFixed(4)),
        lon: Number(result.longitude.toFixed(4)),
        label: labelParts.join(', '),
    };
}
