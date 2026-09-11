const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherApiError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'WeatherApiError';
    this.type = type;
  }
}

export const getCurrentWeather = async (city, unit = 'celsius') => {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric&lang=id`;

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
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
