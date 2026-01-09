import koreaDistricts from '../data/korea_districts.json';
import { disassemble } from 'es-hangul';

export interface LocationItem {
  id: string;
  province: string;
  city?: string;
  town?: string;
  displayName: string;  // Original location name (never changes)
  customTitle?: string;  // User-editable custom title (optional)
  fullAddress: string;
  lat: number;
  lon: number;
}

function parseLocation(raw: string): LocationItem {
  const parts = raw.split('-');
  const province = parts[0];
  const city = parts.length > 1 ? parts[1] : undefined;
  const town = parts.length > 2 ? parts[2] : undefined;

  let displayName = province;
  if (town) displayName = town;
  else if (city) displayName = city;
  return {
    id: raw,
    province,
    city,
    town,
    displayName,
    fullAddress: parts.join(' '),
    lat: 37.5665,
    lon: 126.9780,
  };
}

export function searchLocations(query: string): LocationItem[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const disassembledQuery = disassemble(lowerQuery);

  const results = (koreaDistricts as string[])
    .filter((raw) => {
      const cleanRaw = raw.replace(/-/g, ' ');
      const disassembledRaw = disassemble(cleanRaw);
      return disassembledRaw.includes(disassembledQuery);
    })
    .map(parseLocation);

  return results.sort((a, b) => {
    const aMatch = disassemble(a.displayName.toLowerCase()).includes(disassembledQuery);
    const bMatch = disassemble(b.displayName.toLowerCase()).includes(disassembledQuery);
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;

    return a.fullAddress.length - b.fullAddress.length;
  }).slice(0, 50);
}
