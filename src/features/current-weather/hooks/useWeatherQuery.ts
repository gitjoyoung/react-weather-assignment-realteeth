import { useQuery, useQueries } from '@tanstack/react-query';
import { get24HourWeatherTimeline } from '@/entities/weather/model/weatherService';

export const weatherKeys = {
  all: ['weather'] as const,
  current: (lat: number, lon: number) => [...weatherKeys.all, 'current', lat, lon] as const,
};

/**
 * 24시간 날씨 데이터 조회
 * - 과거 6시간 (실측) + 미래 18시간 (예보)
 */
export function useWeather(lat: number, lon: number) {
  return useQuery({
    queryKey: weatherKeys.current(lat, lon),
    queryFn: () => get24HourWeatherTimeline(lat, lon),
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 30, // 30분
    retry: 1,
  });
}

export function useMultiWeather(locations: { lat: number, lon: number }[]) {
  return useQueries({
    queries: locations.map((loc) => ({
      queryKey: weatherKeys.current(loc.lat, loc.lon),
      queryFn: () => get24HourWeatherTimeline(loc.lat, loc.lon),
      staleTime: 1000 * 60 * 10, // 10분
      gcTime: 1000 * 60 * 30, // 30분
      retry: 1,
    })),
  });
}
