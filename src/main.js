import {
  getCurrentWeather,
  getForecast,
  WeatherApiError,
} from './api/weather.js';

import {
  renderCurrentWeather,
  renderForecast,
  renderHistory,
} from './ui/render.js';

import {
  showLoading,
  showError,
  showEmpty,
  showCard,
} from './ui/state.js';

import {
  getHistory,
  addToHistory,
  clearHistory,
} from './utils/storage.js';

const el = (id) =>
  document.getElementById(id);

const state = {
  isLoading: false,
  unit: 'celsius',
  currentCity: null,
  currentData: null,
  forecastData: null,
  history: [],
  error: null,
};

const refreshHistory = () => {
  state.history = getHistory();

  renderHistory(
    state.history,
    (city) => searchCity(city)
  );

  const historyPageList = el('history-page-list');
  const historyClearPage = el('history-clear-page');

  if (!historyPageList) return;

  historyPageList.innerHTML = '';

  if (state.history.length === 0) {
    historyPageList.innerHTML = `
      <p class="empty-history">
        Belum ada kota yang dicari.
      </p>
    `;

    if (historyClearPage) {
      historyClearPage.hidden = true;
    }

    return;
  }

  state.history.forEach((entry) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'history-page-item';

    button.innerHTML = `
      <span class="history-page-icon">◷</span>
      <span class="history-page-city">${entry.city}</span>
      <span class="history-page-arrow">↗</span>
    `;

    button.addEventListener(
      'click',
      () => searchCity(entry.city)
    );

    historyPageList.appendChild(button);
  });

  if (historyClearPage) {
    historyClearPage.hidden = false;
  }
};

const searchCity = async (city) => {
  const trimmed = city.trim();

  if (!trimmed) {
    showError(
      'Silakan masukkan nama kota.'
    );

    return;
  }

  el('city-input').value = trimmed;

  el('history-page').hidden = true;

  state.isLoading = true;
  state.error = null;

  showLoading();

  try {
    const data =
      await getCurrentWeather(
        trimmed,
        state.unit
      );

    state.currentCity = trimmed;
    state.currentData = data;

    renderCurrentWeather(
      data,
      state.unit
    );

    try {
      const forecast =
        await getForecast(
          trimmed
        );

      state.forecastData = forecast;

      renderForecast(
        forecast,
        state.unit
      );

    } catch (forecastError) {
      state.forecastData = null;

      el(
        'hourly-list'
      ).innerHTML = `
        <p class="empty-history">
          Forecast sementara tidak tersedia.
        </p>
      `;

      console.warn(
        forecastError
      );
    }

    addToHistory(
      data.name
    );

    refreshHistory();

    showCard();

    el('history-panel').hidden = false;

  } catch (error) {

    if (
      error instanceof WeatherApiError
    ) {

      if (
        error.type === 'not-found'
      ) {

        showError(
          'Kota tidak ditemukan. Periksa nama kota dan coba lagi.'
        );

      } else if (
        error.type === 'network'
      ) {

        showError(
          'Network error. Periksa koneksi internet kamu lalu coba lagi.'
        );

      } else {

        showError(
          error.message
        );
      }

    } else {

      console.error(
        error
      );

      showError(
        'Terjadi kesalahan tak terduga. Silakan coba lagi.'
      );
    }

  } finally {

    state.isLoading = false;
  }
};

const handleUnitToggle = () => {
  state.unit =
    state.unit === 'celsius'
      ? 'fahrenheit'
      : 'celsius';

  el(
    'unit-toggle'
  ).textContent =
    state.unit === 'celsius'
      ? '°C'
      : '°F';

  if (
    state.currentData
  ) {

    renderCurrentWeather(
      state.currentData,
      state.unit
    );
  }

  if (
    state.forecastData
  ) {

    renderForecast(
      state.forecastData,
      state.unit
    );
  }
};

const setActiveNav = (
  target
) => {

  document
    .querySelectorAll(
      '.nav-item'
    )
    .forEach(
      (item) =>
        item.classList.remove(
          'active'
        )
    );

  target.classList.add(
    'active'
  );
};

const scrollToSearch = (
  event
) => {

  setActiveNav(
    event.currentTarget
  );

  el('history-page').hidden = true;

  if (
    state.currentData
  ) {
    showCard();
    el('history-panel').hidden = false;
  } else {
    showEmpty();
    el('history-panel').hidden = true;
  }

  el(
    'city-input'
  ).focus();

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const scrollToHistory = (
  event
) => {

  setActiveNav(
    event.currentTarget
  );

  el('empty-state').hidden = true;
  el('loading-panel').hidden = true;
  el('error-banner').hidden = true;
  el('weather-content').hidden = true;
  el('history-panel').hidden = true;
  el('history-page').hidden = false;

  refreshHistory();

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const scrollToHome = (
  event
) => {

  setActiveNav(
    event.currentTarget
  );

  el('history-page').hidden = true;

  if (
    state.currentData
  ) {

    showCard();

    el('history-panel').hidden = false;

  } else {

    showEmpty();

    el('history-panel').hidden = true;
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

let suggestionBox = null;
let selectedSuggestion = -1;

const createSuggestionBox = () => {
  const searchBox =
    document.querySelector(
      '.search-box'
    );

  if (!searchBox) return;

  suggestionBox =
    document.createElement(
      'div'
    );

  suggestionBox.className =
    'search-suggestions';

  searchBox.appendChild(
    suggestionBox
  );
};

const hideSuggestions = () => {
  if (!suggestionBox) return;

  suggestionBox.classList.remove(
    'visible'
  );

  suggestionBox.innerHTML = '';

  selectedSuggestion = -1;
};

const showSuggestions = (
  value
) => {

  if (!suggestionBox) return;

  const query =
    value.trim().toLowerCase();

  if (!query) {
    hideSuggestions();
    return;
  }

  const history =
    getHistory();

  const matches =
    history
      .map(
        (entry) =>
          entry.city
      )
      .filter(
        (city, index, array) =>
          array.indexOf(city) === index
      )
      .filter(
        (city) =>
          city
            .toLowerCase()
            .includes(query)
      )
      .slice(0, 5);

  if (
    matches.length === 0
  ) {

    hideSuggestions();
    return;
  }

  suggestionBox.innerHTML = '';

  matches.forEach(
    (city) => {

      const button =
        document.createElement(
          'button'
        );

      button.type = 'button';

      button.className =
        'search-suggestion';

      button.innerHTML = `
        <span class="suggestion-icon">⌕</span>
        <span class="suggestion-city">
          ${city}
        </span>
      `;

      button.addEventListener(
        'mousedown',
        (event) => {

          event.preventDefault();

          el(
            'city-input'
          ).value = city;

          hideSuggestions();

          searchCity(city);
        }
      );

      suggestionBox.appendChild(
        button
      );
    }
  );

  suggestionBox.classList.add(
    'visible'
  );
};

const updateSuggestionSelection = () => {

  if (!suggestionBox) return;

  const items =
    suggestionBox.querySelectorAll(
      '.search-suggestion'
    );

  items.forEach(
    (item, index) => {

      item.classList.toggle(
        'selected',
        index ===
          selectedSuggestion
      );
    }
  );
};

const handleSuggestionKeyboard = (
  event
) => {

  if (!suggestionBox) return;

  const items =
    suggestionBox.querySelectorAll(
      '.search-suggestion'
    );

  if (
    !suggestionBox.classList.contains(
      'visible'
    ) ||
    items.length === 0
  ) {
    return;
  }

  if (
    event.key === 'ArrowDown'
  ) {

    event.preventDefault();

    selectedSuggestion =
      Math.min(
        selectedSuggestion + 1,
        items.length - 1
      );

    updateSuggestionSelection();

    return;
  }

  if (
    event.key === 'ArrowUp'
  ) {

    event.preventDefault();

    selectedSuggestion =
      Math.max(
        selectedSuggestion - 1,
        0
      );

    updateSuggestionSelection();

    return;
  }

  if (
    event.key === 'Enter'
  ) {

    if (
      selectedSuggestion >= 0
    ) {

      event.preventDefault();

      const city =
        items[
          selectedSuggestion
        ]
          .querySelector(
            '.suggestion-city'
          )
          .textContent
          .trim();

      el(
        'city-input'
      ).value = city;

      hideSuggestions();

      searchCity(city);
    }

    return;
  }

  if (
    event.key === 'Escape'
  ) {

    hideSuggestions();
  }
};

const clearSearchInput = () => {

  el(
    'city-input'
  ).value = '';

  el(
    'city-input'
  ).focus();
};

const init = async () => {

  refreshHistory();
  createSuggestionBox();

  showEmpty();

  el(
    'history-page'
  ).hidden = true;

  el(
    'history-panel'
  ).hidden = true;

  el(
    'search-form'
  ).addEventListener(
    'submit',
    (event) => {

      event.preventDefault();

      searchCity(
        el(
          'city-input'
        ).value
      );
    }
  );

  el(
    'city-input'
  ).addEventListener(
    'input',
    (event) => {

      selectedSuggestion = -1;

      showSuggestions(
        event.target.value
      );
    }
  );

  el(
    'city-input'
  ).addEventListener(
    'keydown',
    handleSuggestionKeyboard
  );

  el(
    'city-input'
  ).addEventListener(
    'focus',
    (event) => {

      showSuggestions(
        event.target.value
      );
    }
  );

  document.addEventListener(
    'click',
    (event) => {

      if (
        !event.target.closest(
          '.search-box'
        )
      ) {

        hideSuggestions();
      }
    }
  );

  el(
    'clear-search'
  ).addEventListener(
    'click',
    clearSearchInput
  );

  el(
    'unit-toggle'
  ).addEventListener(
    'click',
    handleUnitToggle
  );

  el(
    'nav-home'
  ).addEventListener(
    'click',
    scrollToHome
  );

  el(
    'nav-search'
  ).addEventListener(
    'click',
    scrollToSearch
  );

  el(
    'nav-history'
  ).addEventListener(
    'click',
    scrollToHistory
  );

  el(
    'clear-history'
  ).addEventListener(
    'click',
    () => {

      clearHistory();

      refreshHistory();
    }
  );

  el(
    'history-clear-page'
  ).addEventListener(
    'click',
    () => {

      clearHistory();

      refreshHistory();
    }
  );
};

document.addEventListener(
  'DOMContentLoaded',
  init
);