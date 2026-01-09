import axios from 'axios';
import { WEATHER_API_CONFIG } from './weatherConfig';
import { getBaseDateTime, convertToGrid } from './weatherUtils';

export const weatherClient = axios.create({
  baseURL: WEATHER_API_CONFIG.BASE_URL,
});

export const fetchWeather = async (lat: number, lon: number) => {
  const { baseDate, baseTime } = getBaseDateTime();
  const { nx, ny } = convertToGrid(lat, lon);

  const response = await weatherClient.get('', {
    params: {
      serviceKey: WEATHER_API_CONFIG.SERVICE_KEY,
      ...WEATHER_API_CONFIG.DEFAULT_PARAMS,
      base_date: baseDate,
      base_time: baseTime,
      nx,
      ny,
    },
  });

  if (response.data.response?.header?.resultCode !== '00') {
    throw new Error(response.data.response?.header?.resultMsg || 'API Error');
  }

  return response.data.response.body.items.item;
};
