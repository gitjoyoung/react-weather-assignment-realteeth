import { disassembleHangul } from '@/shared/lib/hangul/disassemble';

export interface LocationItem {
  id: string;
  province: string;
  city?: string;
  town?: string;
  displayName: string;
  customTitle?: string;
  fullAddress: string;
  lat: number;
  lon: number;
}

/**
 * 원본 문자열을 LocationItem으로 파싱
 * 예: "서울특별시-강남구-삼성동" → { province: "서울특별시", city: "강남구", town: "삼성동" }
 */
function parseLocationString(rawLocationString: string): LocationItem {
  const addressParts = rawLocationString.split('-');
  const province = addressParts[0];
  const city = addressParts.length > 1 ? addressParts[1] : undefined;
  const town = addressParts.length > 2 ? addressParts[2] : undefined;

  let displayName = province;
  if (town) {
    displayName = town;
  } else if (city) {
    displayName = city;
  }

  return {
    id: rawLocationString,
    province,
    city,
    town,
    displayName,
    fullAddress: addressParts.join(' '),
    lat: 37.5665,
    lon: 126.9780,
  };
}

/**
 * 압축된 트리 구조를 평탄화된 문자열 배열로 변환
 * 예: { "서울": { "강남구": ["삼성동", "역삼동"] } } → ["서울", "서울-강남구", "서울-강남구-삼성동", ...]
 */
function flattenDistrictTree(treeNode: any, currentPath = ''): string[] {
  let flattenedList: string[] = [];

  if (Array.isArray(treeNode)) {
    return treeNode.map(leafNode =>
      currentPath ? `${currentPath}-${leafNode}` : leafNode
    );
  }

  if (typeof treeNode === 'object' && treeNode !== null) {
    if (currentPath) {
      flattenedList.push(currentPath);
    }

    for (const childKey in treeNode) {
      const childPath = currentPath ? `${currentPath}-${childKey}` : childKey;
      flattenedList = flattenedList.concat(
        flattenDistrictTree(treeNode[childKey], childPath)
      );
    }
  }

  return flattenedList;
}

/**
 * 검색 결과 정렬 비교 함수
 * 1. displayName이 검색어와 정확히 일치하는 항목 최우선
 * 2. displayName이 검색어를 포함하는 항목 우선
 * 3. 주소 길이가 짧은 항목 우선 (더 상위 지역)
 */
function compareLocationsByRelevance(
  locationA: LocationItem,
  locationB: LocationItem,
  normalizedQuery: string,
  disassembledQuery: string
): number {
  const aDisplayNameLower = locationA.displayName.toLowerCase();
  const bDisplayNameLower = locationB.displayName.toLowerCase();
  const aDisassembled = disassembleHangul(aDisplayNameLower);
  const bDisassembled = disassembleHangul(bDisplayNameLower);

  // 1순위: 정확히 일치
  const isAExactMatch = aDisplayNameLower === normalizedQuery || aDisassembled === disassembledQuery;
  const isBExactMatch = bDisplayNameLower === normalizedQuery || bDisassembled === disassembledQuery;

  if (isAExactMatch && !isBExactMatch) return -1;
  if (!isAExactMatch && isBExactMatch) return 1;

  // 2순위: displayName에 포함
  const isADisplayNameMatch = aDisassembled.includes(disassembledQuery);
  const isBDisplayNameMatch = bDisassembled.includes(disassembledQuery);

  if (isADisplayNameMatch && !isBDisplayNameMatch) return -1;
  if (!isADisplayNameMatch && isBDisplayNameMatch) return 1;

  // 3순위: 주소 길이 (짧을수록 상위 지역)
  return locationA.fullAddress.length - locationB.fullAddress.length;
}

/**
 * 검색어로 지역 목록 검색
 * 한글 자모 분리를 통한 초성 검색 지원
 */
export async function searchLocations(searchQuery: string): Promise<LocationItem[]> {
  if (!searchQuery.trim()) return [];

  const normalizedQuery = searchQuery.toLowerCase();
  const disassembledQuery = disassembleHangul(normalizedQuery);

  const districtTreeModule = await import('../data/korea_districts_tree.json');
  const districtTree = districtTreeModule.default;
  const allDistrictStrings = flattenDistrictTree(districtTree);

  const matchedLocations = allDistrictStrings
    .filter((districtString) => {
      const cleanedString = districtString.replace(/-/g, ' ');
      const disassembledString = disassembleHangul(cleanedString);
      return disassembledString.includes(disassembledQuery);
    })
    .map(parseLocationString);

  const sortedResults = matchedLocations.sort((a, b) =>
    compareLocationsByRelevance(a, b, normalizedQuery, disassembledQuery)
  );

  return sortedResults.slice(0, 50);
}
