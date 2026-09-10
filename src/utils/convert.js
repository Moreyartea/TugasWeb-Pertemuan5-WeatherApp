/**
 * @param {number} celsius
 * @returns {number} rounded Fahrenheit value
 */
export const celsiusToFahrenheit = (celsius) =>
  Math.round(celsius * (9 / 5) + 32);

/**
 * Format a Celsius temperature for display in the given unit.
 * @param {number} celsius
 * @param {'celsius' | 'fahrenheit'} unit
 * @returns {string} e.g. "27°C" or "81°F"
 */
export const formatTemperature = (celsius, unit) => {
  if (unit === 'fahrenheit') {
    return `${celsiusToFahrenheit(celsius)}°F`;
  }
  return `${Math.round(celsius)}°C`;
};
