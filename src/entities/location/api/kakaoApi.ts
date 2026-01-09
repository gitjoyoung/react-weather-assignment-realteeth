import axios from 'axios';
import { KAKAO_API_CONFIG } from './kakaoConfig';

export interface KakaoAddressDocument {
  address_name: string;
  address_type: string;
  x: string; // longitude
  y: string; // latitude
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_3depth_h_name: string;
    h_code: string;
    b_code: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    x: string;
    y: string;
  };
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
    x: string;
    y: string;
  } | null;
}

export interface KakaoRegionDocument {
  region_type: string; // 'H' (행정동) or 'B' (법정동)
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  code: string;
  x: string;
  y: string;
}

interface KakaoApiResponse<T> {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: T[];
}

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
