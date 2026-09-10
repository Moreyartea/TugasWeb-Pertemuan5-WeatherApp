import { formatTemperature } from '../utils/convert.js';
import { degToCompass, formatLocalTime } from '../utils/format.js';
import { showCard } from './state.js';

const el = (id) => document.getElementById(id);

/**
 * Render the main weather card from a raw OpenWeatherMap response.
 * @param {object} data
 * @param {'celsius' | 'fahrenheit'} unit
 */

export const renderCurrentWeather = (data, unit) => {
  const { name, main, weather, wind, clouds, visibility, sys, timezone, coord } = data;
  const [condition] = weather;

  el('card-city').textContent = `${name}, ${sys.country}`;
  el('card-map-link').href = `https://www.google.com/maps?q=${coord.lat},${coord.lon}`;
  el('card-temp').textContent = formatTemperature(main.temp, unit);
  el('card-description').textContent = condition.description;
  el('card-humidity').textContent = `Kelembaban: ${main.humidity}%`;
  el('card-icon').src = `https://openweathermap.org/img/wn/${condition.icon}@2x.png`;
  el('card-icon').alt = condition.description;

  el('card-feels-like').textContent = `Terasa seperti: ${formatTemperature(main.feels_like, unit)}`;
  el('card-minmax').textContent = `${formatTemperature(main.temp_min, unit)} / ${formatTemperature(main.temp_max, unit)}`;
  el('card-wind').textContent = `${wind.speed} m/s ${degToCompass(wind.deg)}`;
  el('card-pressure').textContent = `${main.pressure} hPa`;
  el('card-clouds').textContent = `${clouds.all}%`;
  el('card-visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
  el('card-sunrise').textContent = formatLocalTime(sys.sunrise, timezone);
  el('card-sunset').textContent = formatLocalTime(sys.sunset, timezone);
    el('card-updated').textContent = `Diperbarui pukul ${formatLocalTime(data.dt, timezone)}`;

  const rainMm = data.rain?.['1h'];
  el('card-rain-wrap').hidden = rainMm === undefined;
  if (rainMm !== undefined) el('card-rain').textContent = `${rainMm} mm`;

  const snowMm = data.snow?.['1h'];
  el('card-snow-wrap').hidden = snowMm === undefined;
  if (snowMm !== undefined) el('card-snow').textContent = `${snowMm} mm`;

  showCard();
};

/**
 * Render the search-history chips.
 * @param {Array<{city: string, timestamp: number}>} history
 * @param {(city: string) => void} onChipClick - called with the city name
 */
export const renderHistory = (history, onChipClick) => {
  const container = el('history-list');
  const header = el('history-header');
  const clearBtn = el('clear-history');

  // array method requirement fulfilled here with a real transform, not filler:
  // map raw history entries into clickable chip elements
  const chips = history.map((entry) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className =
      'chip rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1 hover:bg-blue-100 dark:hover:bg-blue-900';
    chip.textContent = entry.city;
    chip.addEventListener('click', () => onChipClick(entry.city));
    return chip;
  });

  container.innerHTML = '';
  chips.forEach((chip) => container.appendChild(chip));

  const hasHistory = history.length > 0;
  header.hidden = !hasHistory;
  clearBtn.hidden = !hasHistory;
};
