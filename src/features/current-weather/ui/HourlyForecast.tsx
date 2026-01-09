import { useRef, useEffect } from 'react';
import { extractHourlyForecast } from '@/features/current-weather/lib/weatherDataUtils';
import { useWeather } from '@/entities/weather/model/useWeatherQuery';
import { cn } from '@/shared/lib/utils';
import type { LocationItem } from '@/entities/location/hooks/locationService';

interface HourlyForecastProps {
  location?: LocationItem;
}

export function HourlyForecast({ location }: HourlyForecastProps) {
  const { data } = useWeather(location?.lat || 0, location?.lon || 0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate current date/time to identify "NOW"
  const now = new Date();
  const currentHour = now.getHours();
  const todayStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

  const hourlyData = data ? extractHourlyForecast(data) : [];

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (container) {
        const nowElement = container.querySelector<HTMLElement>('[data-is-now="true"]');
        if (nowElement) {
          const containerWidth = container.clientWidth;
          const targetLeft = nowElement.offsetLeft;
          const targetWidth = nowElement.clientWidth;
          
          const scrollPos = targetLeft - (containerWidth / 2) + (targetWidth / 2);
          
          container.scrollTo({
            left: scrollPos,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [hourlyData]);

  if (!data || hourlyData.length === 0) return null;


  return (
    <div className="w-full mt-4 px-1">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-3 custom-scrollbar mask-gradient-r cursor-grab active:cursor-grabbing border-t border-white/10 pt-4 touch-pan-x"
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {hourlyData.map((item) => {
          const itemHour = parseInt(item.time.substring(0, 2));
          const isToday = item.date === todayStr;
          const isNow = isToday && itemHour === currentHour;

          return (
            <div
              key={`${item.date}-${item.time}`}
              data-is-now={isNow}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[3.5rem] shrink-0 border-r border-white/5 last:border-none transition-opacity duration-500",
                isNow ? "opacity-100 scale-110 font-bold text-yellow-300" : "opacity-60"
              )}
            >
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  {isNow ? 'NOW' : item.time.substring(0, 2)}
                </span>
                <span className="text-sm font-bold tracking-tight">{Math.round(Number(item.temp))}°</span>
            </div>
          );
        })}
      </div>
      <div className="text-[10px] text-center text-white/30 mt-1">
        Data Count: {hourlyData.length}
      </div>
    </div>
  );
}
