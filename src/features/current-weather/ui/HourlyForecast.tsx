import { extractHourlyForecastFromTimeline } from '@/entities/weather/lib/weatherDataUtils';
import { cn } from '@/shared/lib/utils';
import type { HourlyWeatherData } from '@/entities/weather/model/weatherTypes';

interface HourlyForecastProps {
  data: HourlyWeatherData[];
}

export function HourlyForecast({ data }: HourlyForecastProps) {
  const hourlyData = extractHourlyForecastFromTimeline(data);

  if (hourlyData.length === 0) return null;

  return (
    <div className="w-full mt-4 px-1 relative z-50 no-drag">
      <div
        className="flex overflow-x-auto pb-3 custom-scrollbar mask-gradient-r border-t border-white/10 pt-4 pointer-events-auto touch-pan-x"
        onPointerDownCapture={(e) => e.stopPropagation()}
        onTouchStartCapture={(e) => e.stopPropagation()}
        onMouseDownCapture={(e) => e.stopPropagation()}
        onPointerMoveCapture={(e) => e.stopPropagation()}
      >
        {hourlyData.map((item) => {
          const isNow = item.isCurrent;
          const isPast = item.isObservation && !isNow;

          return (
            <div
              key={`${item.date}-${item.time}`}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[3.5rem] shrink-0 border-r border-white/5 last:border-none transition-opacity duration-500",
                isNow ? "opacity-100 scale-110 font-bold text-yellow-300" : (isPast ? "opacity-30" : "opacity-60")
              )}
            >
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  {isNow ? 'NOW' : (isPast ? 'PAST' : item.time.substring(0, 2))}
                </span>
                <span className="text-sm font-bold tracking-tight">{Math.round(Number(item.temp))}°</span>
            </div>
          );
        })}
      </div>
     
    </div>
  );
}
