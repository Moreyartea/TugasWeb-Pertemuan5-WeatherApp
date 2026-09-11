const STORAGE_KEY = 'weatherapp_history';
const MAX_ENTRIES = 5;

export const getHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addToHistory = (city) => {
  const current = getHistory();

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
