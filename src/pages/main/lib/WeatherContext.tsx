import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { weatherReducer, type WeatherState, type WeatherAction } from '../model/weatherReducer';

interface WeatherContextType {
  state: WeatherState;
  dispatch: React.Dispatch<WeatherAction>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, {
    carouselArray: [],
    favoriteLocations: [],
    searchResult: null,
  });

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
}
