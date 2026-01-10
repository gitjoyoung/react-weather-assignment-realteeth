import { useWeatherContext } from '@/pages/main/lib/WeatherContext';
import type { LocationItem } from '@/entities/location/hooks/locationService';

/**
 * 검색 영역에서 사용하는 훅
 * - favoriteLocations: 즐겨찾기 목록
 * - searchResult: 현재 검색 상태
 * - setSearchResult: 검색 결과 설정
 */
export function useSearchArea() {
    const { state, dispatch } = useWeatherContext();

    const setSearchResult = (location: LocationItem | null) => {
        dispatch({ type: 'SET_SEARCH_RESULT', payload: location });
    };

    return {
        favoriteLocations: state.favoriteLocations,
        searchResult: state.searchResult,
        setSearchResult,
    };
}
