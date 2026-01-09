import { searchAddress, coordToRegion, type KakaoAddressDocument } from '@/entities/location/api/kakaoApi';
import type { LocationItem } from './locationService';
import { QueryClient, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Kakao 주소 데이터를 LocationItem 형식으로 변환
 */
export function mapKakaoAddressToLocation(doc: KakaoAddressDocument): LocationItem {
  return {
    id: `kakao-${doc.y}-${doc.x}`,
    province: doc.address?.region_1depth_name || '',
    city: doc.address?.region_2depth_name || '',
    town: doc.address?.region_3depth_name || '',
    displayName: doc.address?.region_3depth_h_name || doc.address?.region_3depth_name || doc.address_name,
    fullAddress: doc.address_name,
    lat: parseFloat(doc.y),
    lon: parseFloat(doc.x),
  };
}

/**
 * 실시간 주소 검색 (Kakao API 활용)
 */
export async function fetchLocationsRemote(query: string): Promise<LocationItem[]> {
  const documents = await searchAddress(query);
  return documents.map(mapKakaoAddressToLocation);
}

/**
 * 현재 좌표를 기반으로 주소 정보 가져오기
 */
export async function getLocationFromCoords(lat: number, lon: number): Promise<LocationItem | null> {
  const regions = await coordToRegion(lon, lat);
  if (regions.length === 0) return null;

  // 행정동('H') 정보를 우선적으로 사용
  const region = regions.find(r => r.region_type === 'H') || regions[0];

  return {
    id: `coords-${lat}-${lon}`,
    province: region.region_1depth_name,
    city: region.region_2depth_name,
    town: region.region_3depth_name,
    displayName: region.region_3depth_name,
    fullAddress: region.address_name,
    lat,
    lon,
  };
}
