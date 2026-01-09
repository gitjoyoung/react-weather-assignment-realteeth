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

    const timer = setTimeout(() => {
      const results = searchLocations(trimmed);
      setSearchResults(results);
    }, 200); 

    return () => clearTimeout(timer);
  }, [query]);

  return { 
    searchResults, 
    isSearching,
    setIsSearching 
  };
}
