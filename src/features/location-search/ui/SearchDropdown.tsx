import { Search, Star, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { LocationItem } from "@/entities/location/hooks/locationService";

interface SearchDropdownProps {
  isLoading: boolean;
  searchResults: LocationItem[];
  favorites: LocationItem[];
  selectedIndex: number;
  onSelect: (item: LocationItem, source: 'search' | 'favorite') => void;
  onHover: (index: number) => void;
}

export function SearchDropdown({
  isLoading,
  searchResults,
  favorites,
  selectedIndex,
  onSelect,
  onHover,
}: SearchDropdownProps) {
  const hasSearchResults = searchResults.length > 0;
  const hasFavorites = favorites.length > 0;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 min-h-[120px]">
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar py-2 pl-2 pr-3">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 animate-pulse">
            <Loader2 className="w-6 h-6 text-primary animate-spin opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Searching...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hasSearchResults && (
              <div>
                <div className="flex items-center gap-2 mb-2 px-3 py-1 ">
                  <Search className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">검색 결과</span>
                </div>
                <div className="space-y-1">
                  {searchResults.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item, 'search')}
                      onMouseEnter={() => onHover(index)}
                      className={cn(
                        "w-full flex flex-col px-4 py-3 rounded-2xl transition-all text-left group",
                        selectedIndex === index ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-gray-50"
                      )}
                    >
                      <span className="text-sm font-bold text-gray-700">{item.customTitle || item.displayName}</span>
                      <span className="text-[10px] text-gray-400 truncate">{item.fullAddress}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasFavorites && (
              <div>
                <div className="flex items-center gap-2 mb-2 px-3 py-1 ">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">즐겨찾기</span>
                </div>
                <div className="space-y-1">
                  {favorites.map((item, index) => {
                    const globalIndex = searchResults.length + index;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item, 'favorite')}
                        onMouseEnter={() => onHover(globalIndex)}
                        className={cn(
                          "w-full flex flex-col px-4 py-3 rounded-2xl transition-all text-left group",
                          selectedIndex === globalIndex ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-gray-50"
                        )}
                      >
                        <span className="text-sm font-bold text-gray-700">{item.customTitle || item.displayName}</span>
                        <span className="text-[10px] text-gray-400 truncate">{item.fullAddress}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasSearchResults && !hasFavorites && (
              <div className="py-12 text-center">
                <p className="text-xs text-gray-400">지역을 검색해서 즐겨찾기 추가해보세요</p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
