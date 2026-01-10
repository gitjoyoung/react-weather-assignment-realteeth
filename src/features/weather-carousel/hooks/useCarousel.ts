import { useWeatherContext } from '@/pages/main/lib/WeatherContext';

export function useCarousel() {
    const { state } = useWeatherContext();

    return {
        carouselArray: state.carouselArray,
        searchResult: state.searchResult,
    };
}
