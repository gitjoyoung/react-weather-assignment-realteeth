import { useState, useEffect, memo } from 'react';
import { CurrentWeatherCard } from '@/features/current-weather/ui/CurrentWeatherCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/ui/carousel";
import ClassNames from 'embla-carousel-class-names';
import { useCarousel } from '../hooks/useCarousel';
import { cn } from '@/shared/lib/utils';
import type { LocationItem } from '@/entities/location/hooks/locationService';

const DEFAULT_LOCATION: LocationItem = {
  id: 'default-seoul',
  province: '서울특별시',
  city: '중구',
  displayName: '서울특별시 중구',
  fullAddress: '서울특별시 중구',
  lat: 37.5665,
  lon: 126.9780
};

export const WeatherCarousel = memo(function WeatherCarousel() {
  const { carouselArray, searchResult } = useCarousel();
  const [api, setApi] = useState<CarouselApi>();

  const displayList = carouselArray.length === 0 ? [DEFAULT_LOCATION] : carouselArray;

  useEffect(() => {
    if (!api || !searchResult) return;
    
    const timer = setTimeout(() => {
      const index = displayList.findIndex(loc => loc.id === searchResult.id);
      if (index !== -1) {
        api.scrollTo(index);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [api, searchResult?.id, displayList]);

  return (
    <div className="w-full mt-0 mb-4 flex justify-center">
      <Carousel 
        setApi={setApi} 
        className='w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[560px] xl:max-w-[600px] mx-auto'
        viewportClassName="overflow-visible"
        opts={{
          align: "center",
          loop: false,
          containScroll: false,
          watchDrag: (_, event) => {
            return !((event.target as HTMLElement).closest('.no-drag'));
          }
        }}
        plugins={[
          ClassNames({
            snapped: 'is-snapped',
          })
        ]}
      >
        <CarouselContent className="py-8 ml-0">
          {displayList.map((loc) => (
            <CarouselItem 
              key={loc.id}
              className={cn(
                "basis-[88%] sm:basis-[85%] md:basis-[82%] lg:basis-[78%] xl:basis-[75%] px-2 flex justify-center shrink-0",
                "opacity-30 blur-[3px] scale-90 transition-all duration-700",
                "[&.is-snapped]:opacity-100 [&.is-snapped]:blur-none [&.is-snapped]:scale-105",
              )}
            >
              <div className="w-full flex justify-center">
                <CurrentWeatherCard location={loc} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
});
