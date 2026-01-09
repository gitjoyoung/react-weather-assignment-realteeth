import axios from 'axios';
import { WEATHER_API_CONFIG } from './weatherConfig';
import { getBaseDateTime, getVilageBaseDateTime, convertToGrid } from './weatherUtils';

export const weatherClient = axios.create({
  baseURL: WEATHER_API_CONFIG.BASE_URL,
});

export const fetchWeather = async (lat: number, lon: number) => {
  const { baseDate, baseTime } = getBaseDateTime();
  const { baseDate: vilageBaseDate, baseTime: vilageBaseTime } = getVilageBaseDateTime();
  const { nx, ny } = convertToGrid(lat, lon);

  // Parallel requests for Current (UltraSrt) and Daily (Vilage) weather
  const [currentResponse, dailyResponse] = await Promise.all([
    weatherClient.get('', {
      params: {
        serviceKey: WEATHER_API_CONFIG.SERVICE_KEY,
        ...WEATHER_API_CONFIG.DEFAULT_PARAMS,
        base_date: baseDate,
        base_time: baseTime,
        nx,
        ny,
      },
    }).catch(e => {
      console.warn("Failed to fetch ultra srt weather", e);
      return { data: { response: { body: { items: { item: [] } } } } };
    }),
    weatherClient.get(WEATHER_API_CONFIG.VILAGE_FCST_URL, {
      params: {
        serviceKey: WEATHER_API_CONFIG.SERVICE_KEY,
        ...WEATHER_API_CONFIG.DEFAULT_PARAMS,
        numOfRows: 1000, // Increase to ensure we cover today's data fully (previous day overlap can be large)
        base_date: vilageBaseDate,
        base_time: vilageBaseTime,
        nx,
        ny,
      },
    }).catch(e => {
      console.warn("Failed to fetch daily weather", e);
      return { data: { response: { body: { items: { item: [] } } } } };
    })
  ]);

  const currentItems = currentResponse.data.response?.body?.items?.item || [];
  const dailyItems = dailyResponse.data?.response?.body?.items?.item || [];

  return [...currentItems, ...dailyItems];
};
