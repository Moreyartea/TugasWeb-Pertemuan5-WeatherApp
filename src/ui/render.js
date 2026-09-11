import { formatTemperature } from '../utils/convert.js';
import {
  degToCompass,
  formatLocalTime,
} from '../utils/format.js';

const el = (id) => document.getElementById(id);

const getWeatherIcon = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

const getWeatherLabel = (description) =>
  description
    ? description.charAt(0).toUpperCase() +
      description.slice(1)
    : '--';

export const renderCurrentWeather = (
  data,
  unit
) => {

  const {
    name,
    main,
    weather,
    wind,
    clouds,
    visibility,
    sys,
    timezone,
    coord,
  } = data;

  const [condition] = weather;

  el('card-city').textContent =
    name;

  el('card-location').textContent =
    `${sys.country} • OpenWeatherMap`;

  el('card-temp').textContent =
    formatTemperature(
      main.temp,
      unit
    );

  el('card-description').textContent =
    getWeatherLabel(
      condition.description
    );

  el('card-feels-like').textContent =
    `Terasa seperti ${formatTemperature(
      main.feels_like,
      unit
    )}`;

  el('card-icon').src =
    getWeatherIcon(
      condition.icon
    );

  el('card-icon').alt =
    condition.description;

  el('card-humidity').textContent =
    `${main.humidity}%`;

  el('card-wind').textContent =
    `${wind.speed} m/s ${degToCompass(
      wind.deg
    )}`;

  el('card-pressure').textContent =
    `${main.pressure} hPa`;

  

  const cloudsElement =
    el('card-clouds');

  if (cloudsElement && clouds) {
    cloudsElement.textContent =
      `${clouds.all}%`;
  }

  el('card-visibility').textContent =
    `${(visibility / 1000).toFixed(1)} km`;

  el('card-sunrise').textContent =
    formatLocalTime(
      sys.sunrise,
      timezone
    );

  el('card-sunset').textContent =
    formatLocalTime(
      sys.sunset,
      timezone
    );

  el('card-updated').textContent =
    `${formatLocalTime(
      data.dt,
      timezone
    )}`;

  el('card-min').textContent =
    formatTemperature(
      main.temp_min,
      unit
    );

  el('card-max').textContent =
    formatTemperature(
      main.temp_max,
      unit
    );

  el('card-map-link').href =
    `https://www.google.com/maps?q=${coord.lat},${coord.lon}`;

  

  const rainMm =
    data.rain?.['1h'];

  const rainWrap =
    el('rain-wrap');

  const rainElement =
    el('card-rain');

  if (rainWrap) {
    rainWrap.hidden =
      rainMm === undefined;
  }

  if (
    rainElement &&
    rainMm !== undefined
  ) {
    rainElement.textContent =
      `${rainMm} mm`;
  }

  

  const snowMm =
    data.snow?.['1h'];

  const snowWrap =
    el('snow-wrap');

  const snowElement =
    el('card-snow');

  if (snowWrap) {
    snowWrap.hidden =
      snowMm === undefined;
  }

  if (
    snowElement &&
    snowMm !== undefined
  ) {
    snowElement.textContent =
      `${snowMm} mm`;
  }

  

  const date =
    new Date();

  el('card-date').textContent =
    date.toLocaleDateString(
      'id-ID',
      {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    );
};

export const renderForecast = (
  forecast,
  unit
) => {

  const container =
    el('hourly-list');

  if (!container) {
    return;
  }

  container.innerHTML = '';

  const items =
    forecast.list.slice(0, 8);

  

  const cards =
    items.map(
      (item, index) => {

        const card =
          document.createElement(
            'div'
          );

        card.className =
          `hour-card ${
            index === 0
              ? 'active'
              : ''
          }`;

        const time =
          document.createElement(
            'span'
          );

        time.className =
          'hour-time';

        time.textContent =
          new Date(
            item.dt * 1000
          ).toLocaleTimeString(
            'id-ID',
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          );

        const image =
          document.createElement(
            'img'
          );

        image.src =
          getWeatherIcon(
            item.weather[0].icon
          );

        image.alt =
          item.weather[0].description;

        const temperature =
          document.createElement(
            'strong'
          );

        temperature.textContent =
          formatTemperature(
            item.main.temp,
            unit
          );

        const description =
          document.createElement(
            'span'
          );

        description.textContent =
          getWeatherLabel(
            item.weather[0].description
          );

        card.appendChild(time);
        card.appendChild(image);
        card.appendChild(temperature);
        card.appendChild(description);

        return card;
      }
    );

  cards.forEach(
    (card) =>
      container.appendChild(card)
  );
};

export const renderHistory = (
  history,
  onChipClick
) => {

  const container =
    el('history-list');

  const clearButton =
    el('clear-history');

  container.innerHTML = '';

  const cities =
    history.map(
      (entry) => {

        const button =
          document.createElement(
            'button'
          );

        button.type =
          'button';

        button.className =
          'history-chip';

        const city =
          document.createElement(
            'strong'
          );

        city.textContent =
          entry.city;

        const date =
          document.createElement(
            'span'
          );

        date.textContent =
          new Date(
            entry.timestamp
          ).toLocaleDateString(
            'id-ID',
            {
              day: 'numeric',
              month: 'short',
            }
          );

        button.appendChild(city);
        button.appendChild(date);

        button.addEventListener(
          'click',
          () =>
            onChipClick(
              entry.city
            )
        );

        return button;
      }
    );

  cities.forEach(
    (city) =>
      container.appendChild(city)
  );

  if (
    history.length === 0
  ) {

    const empty =
      document.createElement(
        'p'
      );

    empty.className =
      'empty-history';

    empty.textContent =
      'Belum ada kota yang dicari.';

    container.appendChild(
      empty
    );

    clearButton.hidden =
      true;

  } else {

    clearButton.hidden =
      false;
  }
};