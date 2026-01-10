import { disassemble } from 'es-hangul';

/**
 * 한글 문자열을 자모 단위로 분리
 * 예: "강남" → "ㄱㅏㅇㄴㅏㅁ"
 */
export function disassembleHangul(text: string): string {
    return disassemble(text);
}

/**
 * 검색어와 대상 문자열을 자모 분리하여 비교
 * 초성 검색 지원
 */
export function matchHangulSearch(searchQuery: string, targetText: string): boolean {
    const disassembledQuery = disassemble(searchQuery.toLowerCase());
    const disassembledTarget = disassemble(targetText.toLowerCase());

    return disassembledTarget.includes(disassembledQuery);
}
