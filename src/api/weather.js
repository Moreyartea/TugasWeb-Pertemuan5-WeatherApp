const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Custom error so the UI layer can branch on `error.type`
 * instead of parsing message strings.
 */
export class WeatherApiError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'WeatherApiError';
    this.type = type; // 'not-found' | 'network' | 'unknown'
  }
}

/**
 * Fetch current weather for a given city.
 * @param {string} city
 * @param {'celsius' | 'fahrenheit'} unit - kept for symmetry; conversion is
 *   actually done client-side in utils/convert.js so toggling doesn't refetch.
 * @returns {Promise<object>} raw OpenWeatherMap response
 */
export const getCurrentWeather = async (city, unit = 'celsius') => {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric&lang=id`;

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    // fetch() itself rejects (DNS failure, offline, CORS, etc.)
    throw new WeatherApiError(
      'Periksa koneksi internet Anda.',
      'network'
    );
  }

  if (res.status === 404) {
    throw new WeatherApiError('Kota tidak ditemukan.', 'not-found');
  }

  if (!res.ok) {
    throw new WeatherApiError(
      `Terjadi kesalahan (${res.status}). Coba lagi nanti.`,
      'unknown'
    );
  }

  return res.json();
};

/**
 * Placeholder for the deferred 5-day forecast feature.
 * Intentionally not called anywhere yet — see Bagian 1 & 5 of the plan.
 * Safe to implement later without touching current-weather flow.
 */
export const getForecast = async (city) => {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric&lang=id`;

  try {
    const res = await fetch(url);
    if (res.status === 404) {
      throw new WeatherApiError('Kota tidak ditemukan.', 'not-found');
    }
    if (!res.ok) {
      throw new WeatherApiError('Gagal mengambil data forecast.', 'unknown');
    }
    return res.json();
  } catch (err) {
    if (err instanceof WeatherApiError) throw err;
    throw new WeatherApiError('Periksa koneksi internet Anda.', 'network');
  }
};
