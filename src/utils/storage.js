const STORAGE_KEY = 'weatherapp_history';
const MAX_ENTRIES = 5;

/**
 * @returns {Array<{city: string, timestamp: number}>}
 */
export const getHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    // Corrupted or blocked storage shouldn't crash the app
    return [];
  }
};

/**
 * Add a city to history, deduplicating case-insensitively and
 * keeping only the most recent MAX_ENTRIES.
 * @param {string} city
 * @returns {Array<{city: string, timestamp: number}>} updated history
 */
export const addToHistory = (city) => {
  const current = getHistory();

  // dedupe: drop any existing entry for the same city (case-insensitive)
  const deduped = current.filter(
    (entry) => entry.city.toLowerCase() !== city.toLowerCase()
  );

  const updated = [{ city, timestamp: Date.now() }, ...deduped].slice(
    0,
    MAX_ENTRIES
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};
