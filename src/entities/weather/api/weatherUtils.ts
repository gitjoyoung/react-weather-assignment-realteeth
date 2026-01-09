
export const getBaseDateTime = () => {
  const now = new Date();
  let baseDate = '';
  let baseTime = '';

  const hours = now.getHours();
  const minutes = now.getMinutes();

  if (minutes < 45) {
    if (hours === 0) {
      const yesterday = new Date(now.setDate(now.getDate() - 1));
      baseDate = formatDate(yesterday);
      baseTime = '2330';
    } else {
      baseDate = formatDate(now);
      baseTime = padZero(hours - 1) + '30';
    }
  } else {
    baseDate = formatDate(now);
    baseTime = padZero(hours) + '30';
  }

  return { baseDate, baseTime };
};

export const getVilageBaseDateTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Base times: 02, 05, 08, 11, 14, 17, 20, 23
  // API is available ~10 mins after base time. Let's be safe with 15 mins.
  // If current time is 02:10, we can't use 02:00 yet. We must use yesterday 23:00.

  let baseDate = formatDate(now);
  let baseTime = '0200';

  // Calculate adjusted current hour for 3-hour intervals
  // If minutes < 15, treat as previous hour
  let adjustHour = hours;
  if (minutes < 15) {
    adjustHour = hours - 1;
  }

  if (adjustHour < 2) {
    const yesterday = new Date(now.setDate(now.getDate() - 1));
    baseDate = formatDate(yesterday);
    baseTime = '2300';
  } else if (adjustHour < 5) {
    baseTime = '0200';
  } else if (adjustHour < 8) {
    baseTime = '0500';
  } else if (adjustHour < 11) {
    baseTime = '0800';
  } else if (adjustHour < 14) {
    baseTime = '1100';
  } else if (adjustHour < 17) {
    baseTime = '1400';
  } else if (adjustHour < 20) {
    baseTime = '1700';
  } else if (adjustHour < 23) {
    baseTime = '2000';
  } else {
    baseTime = '2300';
  }

  return { baseDate, baseTime };
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = padZero(date.getMonth() + 1);
  const d = padZero(date.getDate());
  return `${y}${m}${d}`;
};

const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export function convertToGrid(lat: number, lon: number) {
  const RE = 6371.00877; // 지구 반지름(km)
  const GRID = 5.0; // 격자 간격(km)
  const SLAT1 = 30.0; // 투영 위도1(degree)
  const SLAT2 = 60.0; // 투영 위도2(degree)
  const OLON = 126.0; // 기준점 경도(degree)
  const OLAT = 38.0; // 기준점 위도(degree)
  const XO = 43; // 기준점 X좌표(GRID)
  const YO = 136; // 기준점 Y좌표(GRID)

  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
}
