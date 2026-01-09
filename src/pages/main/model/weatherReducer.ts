import type { LocationItem } from "@/entities/location/hooks/locationService";

export interface WeatherState {
  favoriteLocations: LocationItem[];
  isSearchOpen: boolean;
  searchedLocation: LocationItem | null;
}

export type WeatherAction =
  | { type: 'ADD_FAVORITE'; payload: LocationItem }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'UPDATE_FAVORITE'; payload: LocationItem }
  | { type: 'REPLACE_OLDEST_FAVORITE'; payload: LocationItem }
  | { type: 'SET_FAVORITES'; payload: LocationItem[] }
  | { type: 'SET_SEARCH_OPEN'; payload: boolean }
  | { type: 'SET_SEARCHED_LOCATION'; payload: LocationItem | null };

export const MAX_FAVORITES = 6;

export function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'ADD_FAVORITE': {
      if (state.favoriteLocations.some(f => f.id === action.payload.id)) return state;
      if (state.favoriteLocations.length >= MAX_FAVORITES) return state;

      const newFavorites = [...state.favoriteLocations, action.payload];
      const isSearched = state.searchedLocation?.id === action.payload.id;
      return {
        ...state,
        favoriteLocations: newFavorites,
        searchedLocation: isSearched ? null : state.searchedLocation
      };
    }

    case 'REMOVE_FAVORITE': {
      const newFavorites = state.favoriteLocations.filter(f => f.id !== action.payload);
      return { ...state, favoriteLocations: newFavorites };
    }

    case 'UPDATE_FAVORITE': {
      const newFavorites = state.favoriteLocations.map(f =>
        f.id === action.payload.id ? action.payload : f
      );
      return {
        ...state,
        favoriteLocations: newFavorites
      };
    }

    case 'REPLACE_OLDEST_FAVORITE': {
      if (state.favoriteLocations.some(f => f.id === action.payload.id)) return state;
      const newFavorites = [...state.favoriteLocations.slice(1), action.payload];
      const isSearched = state.searchedLocation?.id === action.payload.id;
      return {
        ...state,
        favoriteLocations: newFavorites,
        searchedLocation: isSearched ? null : state.searchedLocation
      };
    }

    case 'SET_FAVORITES':
      return { ...state, favoriteLocations: action.payload };

    case 'SET_SEARCH_OPEN':
      return { ...state, isSearchOpen: action.payload };

    case 'SET_SEARCHED_LOCATION':
      return { ...state, searchedLocation: action.payload };

    default:
      return state;
  }
}
