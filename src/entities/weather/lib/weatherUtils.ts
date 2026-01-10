/**
 * 날짜를 YYYYMMDD 형식으로 포맷
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 숫자를 2자리 문자열로 변환 (0 패딩)
 */
function padZero(num: number): string {
  return String(num).padStart(2, '0');
}

/**
 * 초단기실황 API용 기준 시각 계산
 * - 매 시간 30분에 발표
 * - 발표 후 약 10분 후부터 조회 가능
 * - 45분 이전: 이전 시간 30분 사용
 * - 45분 이후: 현재 시간 30분 사용
 */
export function getBaseDateTime() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  let baseDate: string;
  let baseTime: string;

  if (currentMinute < 45) {
    if (currentHour === 0) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      baseDate = formatDate(yesterday);
      baseTime = '2330';
    } else {
      baseDate = formatDate(now);
      baseTime = `${padZero(currentHour - 1)}30`;
    }
  } else {
    baseDate = formatDate(now);
    baseTime = `${padZero(currentHour)}30`;
  }

  return { baseDate, baseTime };
}

/**
 * 단기예보 API용 기준 시각 계산
 * - 하루 8회 발표: 02, 05, 08, 11, 14, 17, 20, 23시
 * - 발표 후 약 10분 후부터 조회 가능
 * - 안정성을 위해 15분 버퍼 적용
 */
export function getVilageBaseDateTime() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  let adjustedHour = currentHour;
  if (currentMinute < 15) {
    adjustedHour = currentHour - 1;
  }

  let baseDate = formatDate(now);
  let baseTime: string;

  if (adjustedHour < 2) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    baseDate = formatDate(yesterday);
    baseTime = '2300';
  } else if (adjustedHour < 5) {
    baseTime = '0200';
  } else if (adjustedHour < 8) {
    baseTime = '0500';
  } else if (adjustedHour < 11) {
    baseTime = '0800';
  } else if (adjustedHour < 14) {
    baseTime = '1100';
  } else if (adjustedHour < 17) {
    baseTime = '1400';
  } else if (adjustedHour < 20) {
    baseTime = '1700';
  } else if (adjustedHour < 23) {
    baseTime = '2000';
  } else {
    baseTime = '2300';
  }

  return { baseDate, baseTime };
}

/**
 * WGS84 경위도를 기상청 격자 좌표로 변환
 * Lambert Conformal Conic 투영법 사용
 * 
 * @param lat 위도 (latitude)
 * @param lon 경도 (longitude)
 * @returns 격자 좌표 { nx, ny }
 */
export function convertToGrid(lat: number, lon: number): { nx: number; ny: number } {
  const EARTH_RADIUS = 6371.00877;
  const GRID_INTERVAL = 5.0;
  const PROJECTION_LAT1 = 30.0;
  const PROJECTION_LAT2 = 60.0;
  const ORIGIN_LON = 126.0;
  const ORIGIN_LAT = 38.0;
  const ORIGIN_X = 43;
  const ORIGIN_Y = 136;

  const DEG_TO_RAD = Math.PI / 180.0;

  const gridRadius = EARTH_RADIUS / GRID_INTERVAL;
  const projLat1Rad = PROJECTION_LAT1 * DEG_TO_RAD;
  const projLat2Rad = PROJECTION_LAT2 * DEG_TO_RAD;
  const originLonRad = ORIGIN_LON * DEG_TO_RAD;
  const originLatRad = ORIGIN_LAT * DEG_TO_RAD;

  let sn = Math.tan(Math.PI * 0.25 + projLat2Rad * 0.5) / Math.tan(Math.PI * 0.25 + projLat1Rad * 0.5);
  sn = Math.log(Math.cos(projLat1Rad) / Math.cos(projLat2Rad)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + projLat1Rad * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(projLat1Rad)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + originLatRad * 0.5);
  ro = (gridRadius * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEG_TO_RAD * 0.5);
  ra = (gridRadius * sf) / Math.pow(ra, sn);

  let theta = lon * DEG_TO_RAD - originLonRad;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + ORIGIN_X + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + ORIGIN_Y + 0.5);

  return { nx, ny };
}
