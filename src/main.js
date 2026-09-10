import './style.css';
import { getCurrentWeather, WeatherApiError } from './api/weather.js';
import { renderCurrentWeather, renderHistory } from './ui/render.js';
import { showLoading, showError, showEmpty } from './ui/state.js';
import { getHistory, addToHistory, clearHistory } from './utils/storage.js';
import { getTheme, applyTheme, toggleTheme } from './utils/theme.js';

const el = (id) => document.getElementById(id);

const state = {
  isLoading: false,
  unit: 'celsius', // 'celsius' | 'fahrenheit'
  theme: 'light',
  currentCity: null,
  currentData: null, // raw response, kept so unit toggle can re-render w/o refetch
  history: [],
  error: null,
};

// ---------- History ----------

const refreshHistory = () => {
  state.history = getHistory();
  renderHistory(state.history, (city) => searchCity(city));
};

// ---------- Core search flow ----------

/**
 * Shared entry point for both form submit and history-chip clicks,
 * per the "one function, two callers" plan.
 * @param {string} city
 */
const searchCity = async (city) => {
  const trimmed = city.trim();
  if (!trimmed) return;

  el('city-input').value = trimmed;
  state.isLoading = true;
  state.error = null;
  showLoading();

  try {
    const data = await getCurrentWeather(trimmed, state.unit);
    state.currentCity = trimmed;
    state.currentData = data;

    renderCurrentWeather(data, state.unit);

    addToHistory(data.name); // store the API's canonical city name
    refreshHistory();
  } catch (err) {
    if (err instanceof WeatherApiError) {
      state.error = err.message;
      showError(err.message);
    } else {
      state.error = 'Terjadi kesalahan tak terduga.';
      showError(state.error);
      console.error(err);
    }
  } finally {
    state.isLoading = false;
  }
};

// ---------- Unit toggle (no refetch) ----------

const handleUnitToggle = () => {
  state.unit = state.unit === 'celsius' ? 'fahrenheit' : 'celsius';
  el('unit-toggle').textContent = state.unit === 'celsius' ? '°C' : '°F';

  if (state.currentData) {
    renderCurrentWeather(state.currentData, state.unit);
  }
};

// ---------- Theme toggle ----------

const handleThemeToggle = () => {
  state.theme = toggleTheme(state.theme);
  el('theme-icon').textContent = state.theme === 'dark' ? '☀️' : '🌙';
};

// ---------- Wiring ----------

const init = () => {
  // theme: apply saved/OS preference before first paint concerns
  state.theme = getTheme();
  applyTheme(state.theme);
  el('theme-icon').textContent = state.theme === 'dark' ? '☀️' : '🌙';

  // history
  refreshHistory();
  if (state.history.length === 0) {
    showEmpty();
  }

  // search form
  el('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    searchCity(el('city-input').value);
  });

  // unit toggle
  el('unit-toggle').addEventListener('click', handleUnitToggle);

  // theme toggle
  el('theme-toggle').addEventListener('click', handleThemeToggle);

  // clear history
  el('clear-history').addEventListener('click', () => {
    clearHistory();
    refreshHistory();
  });
};

document.addEventListener('DOMContentLoaded', init);
