
export const celsiusToFahrenheit = (celsius) =>
  Math.round(celsius * (9 / 5) + 32);

export const formatTemperature = (celsius, unit) => {
  if (unit === 'fahrenheit') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${Math.round(celsius)}°C`;
};
