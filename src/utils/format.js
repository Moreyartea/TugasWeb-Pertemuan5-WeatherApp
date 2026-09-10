const COMPASS_POINTS = [
  'U', 'UTL', 'TL', 'TTL', 'T', 'TTG', 'TG', 'STG',
  'S', 'SBD', 'BD', 'BBD', 'B', 'BBL', 'BL', 'UBL',
];

export const degToCompass = (deg) => {
  const index = Math.round(deg / 22.5) % 16;
  return COMPASS_POINTS[index];
};

export const formatLocalTime = (unixSeconds, timezoneOffsetSeconds) => {
  const localMs = (unixSeconds + timezoneOffsetSeconds) * 1000;
  const date = new Date(localMs);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};