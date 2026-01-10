import type { LocationItem } from "@/entities/location/hooks/locationService";

export interface WeatherState {
  carouselArray: LocationItem[];
  favoriteLocations: LocationItem[];
  searchResult: LocationItem | null;
}

export type WeatherAction =
  | { type: 'ADD_FAVORITE'; payload: LocationItem }
  | { type: 'REMOVE_FAVORITE'; payload: string } // 좋아요 제거
  | { type: 'UPDATE_FAVORITE'; payload: LocationItem } // 이름 변경
  | { type: 'REPLACE_OLDEST_FAVORITE'; payload: LocationItem } // 좋아요 추가 (최대 개수 초과 시)
  | { type: 'SET_FAVORITES'; payload: LocationItem[] } // 좋아요 목록 설정
  | { type: 'SET_SEARCH_RESULT'; payload: LocationItem | null }; // 검색 결과 설정

export const MAX_FAVORITES = 6;

/**
 * favoriteLocations + searchResult를 자동으로 조합하여 carouselArray 생성
 * searchResult가 이미 favoriteLocations에 있으면 중복 추가하지 않음
 */
function updateCarouselArray(state: WeatherState): LocationItem[] {
  const carousel = [...state.favoriteLocations];

  if (state.searchResult) {
    const exists = carousel.some(item => item.id === state.searchResult!.id);
    if (!exists) {
      carousel.push(state.searchResult);
    }
  }

  return carousel;
}

export function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      if (state.favoriteLocations.some(f => f.id === action.payload.id)) return state;
      if (state.favoriteLocations.length >= MAX_FAVORITES) return state;

      const newFavorites = [...state.favoriteLocations, action.payload];
      const newState = {
        ...state,
        favoriteLocations: newFavorites
      };
      return {
        ...newState,
        carouselArray: updateCarouselArray(newState)
      };
    }

    case 'REMOVE_FAVORITE': {
      const newFavorites = state.favoriteLocations.filter(f => f.id !== action.payload);
      const newState = { ...state, favoriteLocations: newFavorites };
      return {
        ...newState,
        carouselArray: updateCarouselArray(newState)
      };
    }

    case 'UPDATE_FAVORITE': {
      const newFavorites = state.favoriteLocations.map(f =>
        f.id === action.payload.id ? action.payload : f
      );
      const newState = {
        ...state,
        favoriteLocations: newFavorites
      };
      return {
        ...newState,
        carouselArray: updateCarouselArray(newState)
      };
    }

    case 'REPLACE_OLDEST_FAVORITE': {
      if (state.favoriteLocations.some(f => f.id === action.payload.id)) return state;
      const newFavorites = [...state.favoriteLocations.slice(1), action.payload];
      const newState = {
        ...state,
        favoriteLocations: newFavorites
      };
      return {
        ...newState,
        carouselArray: updateCarouselArray(newState)
      };
    }

    case 'SET_FAVORITES': {
      const newState = { ...state, favoriteLocations: action.payload };
      return {
        ...newState,
        carouselArray: updateCarouselArray(newState)
      };
    }

    case 'SET_SEARCH_RESULT': {
      const newState = { ...state, searchResult: action.payload };
      return {
        ...newState,
        carouselArray: updateCarouselArray(newState)
      };
    }

    default:
      return state;
  }
}
