const el = (id) => document.getElementById(id);

/**
 * Hide every mutually-exclusive panel (empty state, skeleton, card, error).
 * Called before showing whichever one is relevant next.
 */
export const hideAll = () => {
  el('empty-state').hidden = true;
  el('loading-skeleton').hidden = true;
  el('weather-card').hidden = true;
  el('error-banner').hidden = true;
};

export const showLoading = () => {
  hideAll();
  el('loading-skeleton').hidden = false;
};

/**
 * @param {string} message
 */
export const showError = (message) => {
  hideAll();
  el('error-banner').hidden = false;
  el('error-message').textContent = message;
};

export const showCard = () => {
  hideAll();
  el('weather-card').hidden = false;
};

export const showEmpty = () => {
  hideAll();
  el('empty-state').hidden = false;
};
