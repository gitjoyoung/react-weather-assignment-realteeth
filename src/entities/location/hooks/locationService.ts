// Imports moved to dynamic import inside searchLocations


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

// Helper to inflate the compressed tree into a flat list
function inflateDistricts(node: any, prefix = ''): string[] {
  let result: string[] = [];

  if (Array.isArray(node)) {
    // Leaf nodes (list of towns)
    return node.map(leaf => prefix ? `${prefix}-${leaf}` : leaf);
  }

  if (typeof node === 'object' && node !== null) {
    // If it's the root or an ongoing path, we might also want to include the current prefix as a valid search result
    // (e.g. "Seoul-Gangnam" is valid even if "Seoul-Gangnam-Samsung" exists)
    // The original data included these intermediate paths.
    if (prefix) result.push(prefix);

    for (const key in node) {
      const currentPath = prefix ? `${prefix}-${key}` : key;
      result = result.concat(inflateDistricts(node[key], currentPath));
    }
  }

  return result;
}

export async function searchLocations(query: string): Promise<LocationItem[]> {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const { disassemble } = await import('es-hangul');
  const disassembledQuery = disassemble(lowerQuery);

  const module = await import('../data/korea_districts_tree.json');
  // @ts-ignore
  const districtsTree = module.default;

  // Flattening every time might be expensive if data is huge, but 200KB tree -> 1MB list is fast enough (few ms).
  // Optimization: Memoize this if needed, but for now simple is better.
  const koreaDistricts = inflateDistricts(districtsTree);

  const results = koreaDistricts
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
