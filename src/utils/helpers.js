// Format ISO 8601 duration (PT1H2M10S) to h:mm:ss
export const formatDuration = (iso) => {
  if (!iso) return null;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  if (hours === 0 && minutes === 0 && seconds === 0) return null;
  const mm = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};

export const formatCount = (value) => {
  const num = parseInt(value, 10);
  if (Number.isNaN(num)) return null;
  return num.toLocaleString('en-US');
};

// The YouTube API returns HTML entities in titles/descriptions (e.g. &quot;).
export const decodeEntities = (text) => {
  if (!text) return text;
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
};
