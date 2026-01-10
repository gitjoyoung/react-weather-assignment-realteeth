import { SeasonalTitle } from '@/features/seasonal-title/ui/SeasonalTitle';
import { LocationSearch } from '@/features/location-search/ui/LocationSearch';
import { WeatherCarousel } from '@/features/weather-carousel/ui/WeatherCarousel';
import { WeatherProvider } from '../lib/WeatherContext';
import { useFavoritesSync } from '@/features/favorites/hooks/useFavoritesSync';

export function MainPage() {
  return (
    <WeatherProvider>
      <MainPageContent />
    </WeatherProvider>
  );
}

function MainPageContent() {
  useFavoritesSync();

  return (
    <div className="flex min-h-svh flex-col gap-0 items-center justify-start pt-12 px-2 pb-20 relative overflow-hidden">
      <div className="w-full flex flex-col items-center gap-6 z-[110]">
        <SeasonalTitle />
        <div className="w-full max-w-[340px] flex flex-col gap-2">
          <LocationSearch />
        </div>
      </div>
      <WeatherCarousel />
    </div>
  );
}
