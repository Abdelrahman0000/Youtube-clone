import axios from 'axios';

// Production calls go through the server-side proxy at /api/youtube so the
// RapidAPI key never ships to the browser. For local development only, put
// REACT_APP_RAPID_API_KEY in your local .env to call RapidAPI directly.
const DEV_KEY = process.env.REACT_APP_RAPID_API_KEY;

export const fetchFromAPI = async (url) => {
  if (DEV_KEY) {
    const { data } = await axios.get(`https://youtube-v31.p.rapidapi.com/${url}`, {
      params: { country: 'EG', maxResults: '50' },
      headers: {
        'X-RapidAPI-Key': DEV_KEY,
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
      },
    });
    return data;
  }
  const { data } = await axios.get(`/api/youtube?u=${encodeURIComponent(url)}`);
  return data;
};
