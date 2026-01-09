import { useState } from 'react';
import type { LocationItem } from '@/entities/location/hooks/locationService';
import { Card, CardContent } from '@/shared/ui/card';
import { Wind, Droplets, Star, Edit2, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useWeatherContext } from '@/pages/main/lib/WeatherContext';
import { useWeather } from '@/entities/weather/model/useWeatherQuery';
import { getCurrentDateTime } from '../lib/dateUtils';
import { extractWeatherData } from '../lib/weatherDataUtils';
import { getPtyStyle, getSkyStyle } from '../lib/weatherStyles';
import { WeatherErrorCard } from './WeatherErrorCard';
import { HourlyForecast } from './HourlyForecast';

interface CurrentWeatherCardProps {
  location?: LocationItem;
}

export function CurrentWeatherCard({ location }: CurrentWeatherCardProps) {
  const { state: { favoriteLocations }, dispatch } = useWeatherContext();
  const [tempName, setTempName] = useState(location?.customTitle || location?.displayName || '');

  const { data, isLoading, isError, refetch } = useWeather(location?.lat || 0, location?.lon || 0);

  const isFavorite = location ? favoriteLocations.some(f => f.id === location.id) : false;

  const toggleFavorite = () => {
    if (!location) return;
    
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: location.id });
    } else {
      if (favoriteLocations.length >= 6) {
        const confirmReplace = window.confirm(
          '즐겨찾기가 6개로 가득 찼습니다. 가장 예전에 추가한 지역을 삭제하고 이 지역을 추가하시겠습니까?'
        );
        if (confirmReplace) {
          dispatch({ type: 'REPLACE_OLDEST_FAVORITE', payload: location });
        }
      } else {
        dispatch({ type: 'ADD_FAVORITE', payload: location });
      }
    }
  };

  if (isLoading || !data) {
    return (
      <Card className="w-full max-w-[380px] min-h-[700px] h-auto rounded-[3.5rem] border-none bg-gradient-to-br from-blue-950 via-slate-900 to-black border border-white/5 flex items-center justify-center shadow-2xl">
        <div className="flex flex-col items-center gap-6">
          {/* Bouncing Dots Animation */}
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-3 h-3 bg-white/80 rounded-full animate-bounce" />
          </div>
          
          <div className="flex flex-col items-center gap-1">
             <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Loading</span>
             {location?.displayName && (
               <span className="text-white/40 text-[10px] uppercase tracking-wider">{location.displayName}</span>
             )}
          </div>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <WeatherErrorCard 
        location={location}
        onRetry={() => refetch()}
        onDelete={() => location && dispatch({ type: 'REMOVE_FAVORITE', payload: location.id })}
        isFavorite={isFavorite}
      />
    );
  }

  const weatherData = extractWeatherData(data);
  const weatherStyle = getPtyStyle(weatherData.pty) ?? getSkyStyle(weatherData.sky);
  const { bg, label, icon, shadow } = weatherStyle;
  const { timeText, dateText } = getCurrentDateTime();

  const saveName = () => {
    if (!location) return;
    const updated = { ...location, customTitle: tempName.trim() || undefined };
    if (isFavorite) {
      dispatch({ type: 'UPDATE_FAVORITE', payload: updated });
    } else {
      dispatch({ type: 'SET_SEARCHED_LOCATION', payload: updated });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveName();
      e.currentTarget.blur();
    }
  };

  return (
    <Card className={cn(
      "w-full max-w-[380px] min-h-[600px] h-auto rounded-[3.5rem] border-none text-white relative overflow-hidden transition-all duration-700 group",
      "bg-gradient-to-b shadow-2xl",
      bg,
      shadow
    )}>
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4)_0%,transparent_50%)] animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_0%,transparent_50%)] animate-bounce-subtle" />
      
      <CardContent className="h-full flex flex-col items-center justify-between relative z-10">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-full transition-all duration-500 border bg-white/5 border-white/10 hover:bg-white/15 group/title-box">
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={saveName}
              onKeyDown={handleKeyDown}
              className={cn(
                "bg-transparent border-none outline-none text-base font-bold text-white transition-all duration-300 px-1 py-0.5 w-full truncate",
                "placeholder:text-white/30 cursor-pointer focus:cursor-text text-left",
              )}
              placeholder="커스텀 타이틀"
            />
            <Edit2 className="w-2.5 h-2.5 opacity-80 group-hover/title-box:opacity-100 transition-opacity shrink-0 ml-1" />
          </div>

          <button
            onClick={toggleFavorite}
            className={cn(
              "p-1.5 transition-all duration-300 hover:scale-125 shrink-0",
              isFavorite 
                ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
                : "text-white/30 hover:text-white/90"
            )}
          >
            <Star className={cn("w-5 h-5", isFavorite && "fill-current")} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 mt-2">
          <h3 className="text-2xl font-black tracking-tight drop-shadow-sm">{label}</h3>
          <p className="text-sm font-semibold opacity-80">{location?.displayName || '위치 정보 없음'}</p>
        </div>

        <div className="relative group/icon-area">
          <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full scale-150 group-hover/icon-area:scale-175 transition-transform duration-1000" />
          <div className="relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-float">
            {icon}
          </div>
        </div>

        <div className="flex flex-col items-center gap-0">
          <div className="flex items-start">
            <span className="text-9xl font-black tracking-tighter drop-shadow-lg leading-none">
              {weatherData.temp || '--'}
            </span>
            <span className="text-5xl font-black mt-4 ml-1">°</span>
          </div>
          
          <div className="flex items-center gap-3 mt-2 text-sm font-bold opacity-80">
            <span className="flex items-center gap-1">
              <span className="text-blue-300">▼</span>
              {weatherData.tmn ? Math.round(Number(weatherData.tmn)) : '--'}°
            </span>
            <span className="w-[1px] h-3 bg-white/30" />
            <span className="flex items-center gap-1">
              <span className="text-red-300">▲</span>
              {weatherData.tmx ? Math.round(Number(weatherData.tmx)) : '--'}°
            </span>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-sm font-black uppercase tracking-widest opacity-60">풍속</span>
              <span className="text-sm font-bold flex items-center gap-1">
                <Wind className="w-3 h-3" />
                {weatherData.windSpeed}m/s
              </span>
            </div>
            <div className="w-[1px] h-6 bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-black uppercase tracking-widest opacity-60">습도</span>
              <span className="text-sm font-bold flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {weatherData.humidity}%
              </span>
            </div>
          </div>
        </div>

          
        <HourlyForecast location={location} />

        <div className="flex flex-col items-center gap-1 mt-4">
          <div className="px-5 py-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
            <span className="text-xs tracking-wider">{dateText}</span>
            <div className="w-1 h-1 bg-white/40 rounded-full" />
            <span className="text-xs tracking-wider">{timeText}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
