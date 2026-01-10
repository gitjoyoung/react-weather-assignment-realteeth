import { useEffect } from 'react';
import { useWeatherContext } from '@/pages/main/lib/WeatherContext';

/**
 * 로컬 스토리지와 즐겨찾기 동기화 훅
 * - 앱 시작 시 로컬 스토리지에서 즐겨찾기 불러오기
 * - 즐겨찾기 변경 시 로컬 스토리지에 저장
 */
export function useFavoritesSync() {
    const { state, dispatch } = useWeatherContext();

    // 초기 로드: 로컬 스토리지에서 즐겨찾기 불러오기
    useEffect(() => {
        const stored = localStorage.getItem('favoriteLocations');
        if (stored) {
            try {
                const favorites = JSON.parse(stored);
                dispatch({ type: 'SET_FAVORITES', payload: favorites });
            } catch (error) {
                console.error('즐겨찾기 로드 실패:', error);
            }
        }
    }, [dispatch]);

    // 즐겨찾기 변경 시 로컬 스토리지에 저장
    useEffect(() => {
        localStorage.setItem('favoriteLocations', JSON.stringify(state.favoriteLocations));
    }, [state.favoriteLocations]);
}
