import { SeasonalTitle } from '@/features/seasonal-title/ui/SeasonalTitle';
import { LocationSearch } from '@/features/location-search/ui/LocationSearch';
import { WeatherBoardWidget } from '@/widgets/WeatherBoardWidget/ui/WeatherBoardWidget';
import { WeatherProvider } from '../lib/WeatherContext';

export function MainPage() {
  return (
    <WeatherProvider>
      <div className="flex min-h-svh flex-col gap-0 items-center justify-start pt-12 px-4 pb-20 relative overflow-hidden">
        <div className="w-full flex flex-col items-center gap-6 z-[110]">
          <SeasonalTitle />
          <div className="w-full max-w-[340px] flex flex-col gap-2">
            <LocationSearch />
          </div>
        </div>
        <WeatherBoardWidget />
      </div>
    </WeatherProvider>
  );
}
