import { useState, useEffect, useMemo } from 'react';
import { CurrentWeatherCard } from '@/features/current-weather/ui/CurrentWeatherCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/shared/ui/carousel";
import ClassNames from 'embla-carousel-class-names';
import { useWeatherContext } from '@/pages/main/lib/WeatherContext';
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

export function WeatherBoardWidget() {
  const { state: { favoriteLocations, searchedLocation } } = useWeatherContext();

  const [api, setApi] = useState<CarouselApi>();

  const displayList = useMemo(() => {
    const list = [...favoriteLocations];
    if (searchedLocation && !favoriteLocations.some(f => f.id === searchedLocation.id)) {
      list.push(searchedLocation);
    }
    // 만약 리스트가 비어있다면 기본 위치(서울)를 보여줌
    if (list.length === 0) {
      return [DEFAULT_LOCATION];
    }
    return list;
  }, [favoriteLocations, searchedLocation]);

  useEffect(() => {
    if (!api || !searchedLocation) return;
    
    // Slight delay to ensure the DOM is updated with the new slide before scrolling
    const timer = setTimeout(() => {
      const index = displayList.findIndex(loc => loc.id === searchedLocation.id);
      if (index !== -1) {
        api.scrollTo(index);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [api, searchedLocation?.id, displayList]);



  return (
    <div className="w-full flex flex-col items-center transition-all duration-700 z-0">
      <div className="w-full select-none relative group/slider max-w-[1000px]">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: false,
            containScroll: false
          }}
          plugins={[
            ClassNames({
              snapped: 'is-snapped',
              inView: 'is-in-view'
            })
          ]}
          className="w-full"
          viewportClassName="overflow-visible px-4 md:px-10"
        >
          <CarouselContent className={cn(
            "pt-4 pb-16 items-center",
            displayList.length > 1 ? "-ml-4" : "justify-center"
          )}>
            {displayList.map((loc) => (
              <CarouselItem 
                key={loc.id} 
                className={cn(
                  "basis-auto transition-all duration-500",
                  displayList.length > 1 ? "pl-4" : "pl-0",
                  "opacity-40 blur-[2px] scale-90",
                  "[&.is-snapped]:opacity-100 [&.is-snapped]:blur-none [&.is-snapped]:scale-100"
                )}
              >
                <div className="w-[85vw] max-w-[340px] rounded-[3.5rem] transition-all duration-500 transform-gpu shadow-2xl">
                  <CurrentWeatherCard location={loc} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-1/2 -left-12 -translate-y-1/2 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hidden md:block">
            <CarouselPrevious className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md w-12 h-12" />
          </div>
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10 hidden md:block">
            <CarouselNext className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md w-12 h-12" />
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            {displayList.map((_, index) => (
              <button
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-white/20 transition-all duration-300 hover:bg-white/40"
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </div>
  );
}
