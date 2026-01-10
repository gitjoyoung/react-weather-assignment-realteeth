import type { LocationItem } from '@/entities/location/hooks/locationService';

interface UseKeyboardNavigationProps {
    isSearchOpen: boolean;
    selectedIndex: number;
    setSelectedIndex: (action: number | ((prev: number) => number)) => void;
    currentResults: LocationItem[];
    onSelect: (item: LocationItem) => void;
    onSearch: () => void;
    onClose: () => void;
}

export function useKeyboardNavigation({
    isSearchOpen,
    selectedIndex,
    setSelectedIndex,
    currentResults,
    onSelect,
    onSearch,
    onClose,
}: UseKeyboardNavigationProps) {

    const handleKeyDown = (e: KeyboardEvent) => {
        // 검색창이 닫혀있거나 결과가 없을 때는 엔터키(검색)만 허용
        if (!isSearchOpen || currentResults.length === 0) {
            if (e.key === 'Enter') {
                e.preventDefault();
                onSearch();
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                onClose();
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
                    onSelect(currentResults[selectedIndex]);
                } else {
                    onSearch();
                }
                break;
        }
    };

    return { handleKeyDown };
}
