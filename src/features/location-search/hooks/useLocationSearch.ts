import { useState, useEffect } from 'react';
import { searchLocations } from '@/entities/location/hooks/locationService';
import type { LocationItem } from '@/entities/location/hooks/locationService';

export function useLocationSearch(query: string) {
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(trimmed);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return {
    searchResults,
    isSearching,
    setIsSearching
  };
}
