import { useState, useMemo, useCallback } from "react";
import type { LocationItem } from "@/entities/location/hooks/locationService";
import { useSearchArea } from "../hooks/useSearchArea";
import { getLocationFromCoords, fetchLocationsRemote } from "@/entities/location/hooks/kakaoLocationService";
import { useLocationSearch } from "./useLocationSearch";

/**
 * 검색 컴포넌트의 로직을 관리하는 훅
 * - 전역 상태: useSearchArea 훅 사용 (favoriteLocations, searchResult, setSearchResult)
 * - 로컬 상태: query, selectedIndex, isDetecting, isSearchOpen
 */
export function useLocationSearchController() {
    // 전역 상태 (useSearchArea 훅 사용)
    const { favoriteLocations, setSearchResult } = useSearchArea();

    // 로컬 상태
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isDetecting, setIsDetecting] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // 검색 결과 (디바운싱 적용)
    const { searchResults: localResults, isSearching, setIsSearching } = useLocationSearch(query);

    const hasQuery = query.length > 0;

    // 표시할 목록 계산 (검색 결과 + 즐겨찾기)
    const displayLists = useMemo(() => {
        if (!hasQuery) {
            // 검색어가 없으면 즐겨찾기만 표시
            return { search: [], favorites: favoriteLocations };
        }

        // 검색어가 있으면 검색 결과와 필터링된 즐겨찾기 표시
        const filtered = favoriteLocations.filter(
            fav => !localResults.some(sr => sr.id === fav.id)
        );
        return { search: localResults, favorites: filtered };
    }, [favoriteLocations, localResults, hasQuery]);

    // 전체 결과 목록 (키보드 네비게이션용)
    const currentResults = useMemo(() =>
        [...displayLists.search, ...displayLists.favorites]
        , [displayLists]);

    // 항목 선택 핸들러
    const handleSelect = useCallback((item: LocationItem, source: 'search' | 'favorite' = 'search') => {
        const isFavorite = favoriteLocations.some(f => f.id === item.id);

        if (source === 'search' && !isFavorite) {
            setSearchResult(item);
        } else if (source === 'favorite') {
            setSearchResult(item);
        }

        setIsSearchOpen(false);
        setQuery('');
        setSelectedIndex(-1);
    }, [favoriteLocations, setSearchResult]);

    // 현재 위치 감지 핸들러
    const handleDetect = useCallback(async (e: React.MouseEvent) => {
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
    }, [handleSelect]);

    // 검색 제출 핸들러 (Enter 또는 검색 버튼)
    const handleSearch = useCallback(async () => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;

        setIsSearching(true);
        try {
            // 카카오 API로 원격 검색 시도
            const isRemote = await fetchLocationsRemote(trimmedQuery).then(res => res[0]);
            const target = isRemote || currentResults[0];
            if (target) handleSelect(target, 'search');
        } catch {
            // 실패 시 로컬 결과 중 첫 번째 선택
            if (currentResults.length > 0) handleSelect(currentResults[0]);
        } finally {
            setIsSearching(false);
        }
    }, [query, currentResults, handleSelect, setIsSearching]);

    // 키보드 이벤트 핸들러
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'Escape':
                setIsSearchOpen(false);
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
    }, [currentResults, selectedIndex, handleSelect, handleSearch]);

    // 포커스 핸들러
    const handleFocus = useCallback(() => {
        if (!isSearchOpen) {
            setIsSearchOpen(true);
        }
    }, [isSearchOpen]);

    // 블러 핸들러
    const handleBlur = useCallback((e: React.FocusEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsSearchOpen(false);
        }
    }, []);

    // 검색어 변경 핸들러
    const handleQueryChange = useCallback((val: string) => {
        setQuery(val);
        if (!isSearchOpen) {
            setIsSearchOpen(true);
        }
        setSelectedIndex(-1);
    }, [isSearchOpen]);

    return {
        // 상태
        query,
        selectedIndex,
        isDetecting,
        isSearching,
        isSearchOpen,
        displayLists,

        // 핸들러
        setSelectedIndex,
        handleSelect,
        handleDetect,
        handleKeyDown,
        handleFocus,
        handleBlur,
        handleQueryChange,
        setQuery,
    };
}
