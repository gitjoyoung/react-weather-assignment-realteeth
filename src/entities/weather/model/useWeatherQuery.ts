import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchWeather } from '@/entities/weather/api/weatherApi';

export const weatherKeys = {
  all: ['weather'] as const,
  current: (lat: number, lon: number) => [...weatherKeys.all, 'current', lat, lon] as const,
};

export function useWeather(lat: number, lon: number) {
  return useQuery({
    queryKey: weatherKeys.current(lat, lon),
    queryFn: () => fetchWeather(lat, lon),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useMultiWeather(locations: { lat: number, lon: number }[]) {
  return useQueries({
    queries: locations.map((loc) => ({
      queryKey: weatherKeys.current(loc.lat, loc.lon),
      queryFn: () => fetchWeather(loc.lat, loc.lon),
      staleTime: 1000 * 60 * 10,
      retry: 1,
    })),
  });
}
