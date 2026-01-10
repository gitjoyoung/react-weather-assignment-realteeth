import axios from 'axios';
import { KAKAO_API_CONFIG } from './kakaoConfig';
import type {
  KakaoAddressDocument,
  KakaoRegionDocument,
  KakaoApiResponse
} from '../model/kakaoTypes';

const kakaoClient = axios.create({
  baseURL: KAKAO_API_CONFIG.BASE_URL,
});

kakaoClient.interceptors.request.use((config) => {
  if (KAKAO_API_CONFIG.REST_API_KEY) {
    config.headers.Authorization = `KakaoAK ${KAKAO_API_CONFIG.REST_API_KEY}`;
  }
  return config;
});

export const searchAddress = async (query: string): Promise<KakaoAddressDocument[]> => {
  if (!KAKAO_API_CONFIG.REST_API_KEY) {
    return [];
  }

  try {
    const response = await kakaoClient.get<KakaoApiResponse<KakaoAddressDocument>>('/search/address.json', {
      params: {
        query,
        size: 8,
        sort: 'accuracy'
      },
    });
    return response.data.documents;
  } catch (error) {
    console.error('Kakao Address Search Error:', error);
    return [];
  }
};

export const coordToRegion = async (x: number, y: number): Promise<KakaoRegionDocument[]> => {
  if (!KAKAO_API_CONFIG.REST_API_KEY) {
    console.warn('Kakao REST API Key is missing');
    return [];
  }

  try {
    const response = await kakaoClient.get<KakaoApiResponse<KakaoRegionDocument>>('/geo/coord2regioncode.json', {
      params: { x, y },
    });
    return response.data.documents;
  } catch (error) {
    console.error('Kakao CoordToRegion Error:', error);
    return [];
  }
};
