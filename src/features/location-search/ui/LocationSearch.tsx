import { useRef } from "react";
import { useLocationSearchController } from "../hooks/useLocationSearchController";
import { SearchInput } from "./SearchInput";
import { SearchDropdown } from "./SearchDropdown";

export function LocationSearch() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useLocationSearchController();

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      onBlur={handleBlur}
    >
      <SearchInput 
        value={query}
        onChange={handleQueryChange}
        onClear={() => setQuery('')}
        isFocused={isSearchOpen}
        isLoading={isSearching || isDetecting}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onDetect={handleDetect}
      />

      {isSearchOpen && (
        <SearchDropdown 
          isLoading={isSearching || isDetecting}
          searchResults={displayLists.search}
          favorites={displayLists.favorites}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onHover={setSelectedIndex}
        />
      )}
    </div>
  );
}
