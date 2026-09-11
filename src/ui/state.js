const el = (id) => document.getElementById(id);

export const showLoading = () => {
  el('empty-state').hidden = true;
  el('weather-content').hidden = true;
  el('error-banner').hidden = true;
  el('loading-panel').hidden = false;
};

export const showError = (message) => {
  el('empty-state').hidden = true;
  el('loading-panel').hidden = true;
  el('weather-content').hidden = true;
  el('error-banner').hidden = false;

  el('error-message').textContent = message;
};

export const showEmpty = () => {
  el('loading-panel').hidden = true;
  el('weather-content').hidden = true;
  el('error-banner').hidden = true;
  el('empty-state').hidden = false;
};

export const showCard = () => {
  el('empty-state').hidden = true;
  el('loading-panel').hidden = true;
  el('error-banner').hidden = true;
  el('weather-content').hidden = false;
};