import { useState, useMemo } from "react";
import type { LocationItem } from "@/entities/location/hooks/locationService";
import { useWeatherContext } from "@/pages/main/lib/WeatherContext";
import { getLocationFromCoords, fetchLocationsRemote } from "@/entities/location/hooks/kakaoLocationService";
import { useLocationSearch } from "./useLocationSearch";

export function useLocationSearchController() {
    const { state: { favoriteLocations, isSearchOpen }, dispatch } = useWeatherContext();

    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isDetecting, setIsDetecting] = useState(false);

    const { searchResults: localResults, isSearching, setIsSearching } = useLocationSearch(query);

    const hasQuery = query.length > 0;

    const displayLists = useMemo(() => {
        if (!hasQuery) {
            return { search: [], favorites: favoriteLocations };
        }

        const filtered = favoriteLocations.filter(
            fav => !localResults.some(sr => sr.id === fav.id)
        );
        return { search: localResults, favorites: filtered };
    }, [favoriteLocations, localResults, hasQuery]);

    const currentResults = useMemo(() =>
        [...displayLists.search, ...displayLists.favorites]
        , [displayLists]);

    const handleSelect = (item: LocationItem, source: 'search' | 'favorite' = 'search') => {
        const isFavorite = favoriteLocations.some(f => f.id === item.id);
        if (source === 'search' && !isFavorite) {
            dispatch({ type: 'SET_SEARCHED_LOCATION', payload: item });
        }

        dispatch({ type: 'SET_SEARCH_OPEN', payload: false });
        setQuery('');
        setSelectedIndex(-1);
    };

    const handleDetect = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!navigator.geolocation) {
            alert('위치 정보를 지원하지 않는 브라우저입니다.');
            return;
        }

        setIsDetecting(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const location = await getLocationFromCoords(latitude, longitude);
                    if (location) {
                        handleSelect(location, 'search');
                    }
                } catch (error) {
                    console.error(error);
                    alert('위치 정보를 가져오는데 실패했습니다.');
                } finally {
                    setIsDetecting(false);
                }
            },
            (error) => {
                console.error(error);
                alert('위치 권한을 허용해주세요.');
                setIsDetecting(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const handleSearch = async () => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        setIsSearching(true);
        try {
            const isRemote = await fetchLocationsRemote(trimmedQuery).then(res => res[0]);
            const target = isRemote || currentResults[0];
            if (target) handleSelect(target, 'search');
        } catch {
            if (currentResults.length > 0) handleSelect(currentResults[0]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'Escape':
                dispatch({ type: 'SET_SEARCH_OPEN', payload: false });
                break;
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, currentResults.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < currentResults.length) {
                    handleSelect(currentResults[selectedIndex]);
                } else {
                    handleSearch();
                }
                break;
        }
    };

    const handleFocus = () => {
        if (!isSearchOpen) {
            dispatch({ type: 'SET_SEARCH_OPEN', payload: true });
        }
    };

    const handleBlur = (e: React.FocusEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            dispatch({ type: 'SET_SEARCH_OPEN', payload: false });
        }
    };

    const handleQueryChange = (val: string) => {
        setQuery(val);
        if (!isSearchOpen) {
            dispatch({ type: 'SET_SEARCH_OPEN', payload: true });
        }
        setSelectedIndex(-1);
    };

    return {
        query,
        selectedIndex,
        setSelectedIndex,
        isDetecting,
        isSearching,
        isSearchOpen,
        displayLists,
        handleSelect,
        handleDetect,
        handleKeyDown,
        handleFocus,
        handleBlur,
        handleQueryChange,
        setQuery,
    };
}
