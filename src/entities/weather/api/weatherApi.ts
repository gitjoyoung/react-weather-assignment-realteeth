import axios from 'axios';
import { WEATHER_API_CONFIG } from './weatherConfig';

export const weatherClient = axios.create({
  baseURL: WEATHER_API_CONFIG.BASE_URL,
});

/**
 * 초단기실황 조회 (현재 날씨 - 관측 데이터)
 */
export async function fetchUltraSrtNcst(baseDate: string, baseTime: string, nx: number, ny: number) {
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

  return response.data.response?.body?.items?.item || [];
}

/**
 * 초단기예보 조회 (6시간 예보)
 */
export async function fetchUltraSrtFcst(baseDate: string, baseTime: string, nx: number, ny: number) {
  const response = await weatherClient.get(WEATHER_API_CONFIG.ULTRA_SRT_FCST_URL, {
    params: {
      serviceKey: WEATHER_API_CONFIG.SERVICE_KEY,
      ...WEATHER_API_CONFIG.DEFAULT_PARAMS,
      base_date: baseDate,
      base_time: baseTime,
      nx,
      ny,
    },
  });

  return response.data.response?.body?.items?.item || [];
}

/**
 * 단기예보 조회 (3일 예보)
 */
export async function fetchVilageFcst(baseDate: string, baseTime: string, nx: number, ny: number, numOfRows: number = 1000) {
  const response = await weatherClient.get(WEATHER_API_CONFIG.VILAGE_FCST_URL, {
    params: {
      serviceKey: WEATHER_API_CONFIG.SERVICE_KEY,
      ...WEATHER_API_CONFIG.DEFAULT_PARAMS,
      numOfRows,
      base_date: baseDate,
      base_time: baseTime,
      nx,
      ny,
    },
  });

  return response.data.response?.body?.items?.item || [];
}
