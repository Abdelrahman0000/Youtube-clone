import axios from 'axios';

export const BASE_URL = 'https://youtube-v31.p.rapidapi.com';

const options = {

  params: {
  country: 'EG',
    maxResults: '50'
  },
  headers: {
    'X-RapidAPI-Key': '6c4adc0d50mshebab3d3a21ef909p1841e5jsn13068ce26abf',
    
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
  }
};

export const fetchFromAPI = async (url) => {
  
  const { data } = await axios.get(`${BASE_URL}/${url}`, options);

  return data;
};
