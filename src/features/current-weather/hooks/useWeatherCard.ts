import { useCallback, useMemo } from 'react';
import { useWeatherContext } from '@/pages/main/lib/WeatherContext';
import type { LocationItem } from '@/entities/location/hooks/locationService';
import { MAX_FAVORITES } from '@/pages/main/model/weatherReducer';

/**
 * 웨더 카드에서 사용하는 훅
 * - toggleFavorite: 즐겨찾기 추가/제거
 * - updateCustomName: 커스텀 네임 변경 (즐겨찾기된 항목만 가능)
 * - isFavorite: 해당 위치가 즐겨찾기인지 확인
 * - canAddFavorite: 즐겨찾기 추가 가능 여부
 */
export function useWeatherCard(location: LocationItem) {
    const { state, dispatch } = useWeatherContext();

    // 즐겨찾기 여부 (useMemo로 최적화)
    const isFavorite = useMemo(
        () => state.favoriteLocations.some(f => f.id === location.id),
        [state.favoriteLocations, location.id]
    );

    // 즐겨찾기 추가 가능 여부
    const canAddFavorite = useMemo(
        () => state.favoriteLocations.length < MAX_FAVORITES,
        [state.favoriteLocations.length]
    );

    // 즐겨찾기 토글 (useCallback으로 최적화)
    const toggleFavorite = useCallback(() => {
        if (isFavorite) {
            // 즐겨찾기 제거
            dispatch({ type: 'REMOVE_FAVORITE', payload: location.id });
        } else {
            // 즐겨찾기 추가
            if (canAddFavorite) {
                dispatch({ type: 'ADD_FAVORITE', payload: location });
            } else {
                // 최대 개수 초과 시 가장 오래된 항목 교체
                dispatch({ type: 'REPLACE_OLDEST_FAVORITE', payload: location });
            }
        }
    }, [isFavorite, canAddFavorite, location, dispatch]);

    // 커스텀 네임 업데이트 (useCallback으로 최적화)
    const updateCustomName = useCallback((customTitle: string) => {
        // 커스텀 네임은 즐겨찾기된 항목만 변경 가능
        if (!isFavorite) {
            console.warn('커스텀 네임은 즐겨찾기된 항목만 변경할 수 있습니다.');
            return;
        }

        const updatedLocation = { ...location, customTitle };
        dispatch({ type: 'UPDATE_FAVORITE', payload: updatedLocation });
    }, [isFavorite, location, dispatch]);

    return {
        isFavorite,
        canAddFavorite,
        toggleFavorite,
        updateCustomName,
    };
}
