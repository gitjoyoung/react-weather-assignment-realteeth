import type { KmaWeatherItem } from '@/entities/weather/model/types';
import type { HourlyWeatherData } from '@/entities/weather/model/weatherTypes';

export interface WeatherData {
  temp: string | undefined;
  sky: string | undefined;
  pty: string | undefined;
  humidity: string | undefined;
  windSpeed: string | undefined;
  tmn: string | undefined; // 일 최저 기온
  tmx: string | undefined; // 일 최고 기온
}

export interface HourlyForecastItem {
  date: string;
  time: string;
  temp: string;
  sky: string;
  pty: string;
  isObservation?: boolean;
  isCurrent?: boolean;
}

/**
 * 타임라인 데이터에서 현재 날씨 정보 추출
 */
export const extractWeatherDataFromTimeline = (timeline: HourlyWeatherData[]): WeatherData => {
  const current = timeline.find(item => item.isCurrent);

  // 당일 전체 온도로 최저/최고 계산
  const today = new Date();
  const todayDateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

  const todayTemps = timeline
    .filter(item => item.date === todayDateStr)
    .map(item => item.temp);

  const tmn = todayTemps.length > 0 ? String(Math.min(...todayTemps)) : undefined;
  const tmx = todayTemps.length > 0 ? String(Math.max(...todayTemps)) : undefined;

  return {
    temp: current?.temp !== undefined ? String(current.temp) : undefined,
    sky: current?.sky,
    pty: current?.pty,
    humidity: current?.humidity !== undefined ? String(current.humidity) : undefined,
    windSpeed: current?.windSpeed !== undefined ? String(current.windSpeed) : undefined,
    tmn,
    tmx,
  };
};

/**
 * 타임라인 데이터에서 시간별 예보 추출
 */
export const extractHourlyForecastFromTimeline = (timeline: HourlyWeatherData[]): HourlyForecastItem[] => {
  return timeline.map(item => ({
    date: item.date,
    time: item.time.substring(0, 2) + ':00',
    temp: String(Math.round(item.temp)),
    sky: item.sky || '1',
    pty: item.pty || '0',
    isObservation: item.isObservation,
    isCurrent: item.isCurrent,
  }));
};

/**
 * [Legacy] 기상청 원본 데이터에서 날씨 정보 추출
 */
export const extractWeatherData = (data: KmaWeatherItem[]): WeatherData => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

  const findValue = (category: string) => {
    let item = data.find(i => i.category === category && i.fcstDate === todayStr);
    if (!item) {
      item = data.find(i => i.category === category);
    }
    return item?.fcstValue;
  };

  const todaysTemps = data
    .filter(item => (item.category === 'T1H' || item.category === 'TMP') && item.fcstDate === todayStr)
    .map(item => parseFloat(item.fcstValue));

  let calculatedMin: string | undefined;
  let calculatedMax: string | undefined;

  if (todaysTemps.length > 0) {
    calculatedMin = String(Math.min(...todaysTemps));
    calculatedMax = String(Math.max(...todaysTemps));
  }

  return {
    temp: findValue('T1H') || findValue('TMP'),
    sky: findValue('SKY'),
    pty: findValue('PTY'),
    humidity: findValue('REH'),
    windSpeed: findValue('WSD'),
    tmn: calculatedMin,
    tmx: calculatedMax,
  };
};

/**
 * [Legacy] 기상청 원본 데이터에서 시간별 예보 추출
 */
export const extractHourlyForecast = (data: KmaWeatherItem[]): HourlyForecastItem[] => {
  const result: HourlyForecastItem[] = [];
  const now = new Date();
  const todayStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

  const grouped = new Map<string, Partial<HourlyForecastItem>>();

  data.forEach(item => {
    const key = `${item.fcstDate}-${item.fcstTime}`;
    if (item.fcstDate !== todayStr) return;

    if (!grouped.has(key)) {
      grouped.set(key, { date: item.fcstDate, time: item.fcstTime.substring(0, 2) + ':00' });
    }
    const current = grouped.get(key)!;

    if (item.category === 'T1H') {
      current.temp = item.fcstValue;
    } else if (item.category === 'TMP') {
      if (!current.temp) current.temp = item.fcstValue;
    }

    if (item.category === 'SKY') current.sky = item.fcstValue;
    if (item.category === 'PTY') current.pty = item.fcstValue;
  });

  grouped.forEach((val) => {
    if (val.temp) {
      if (!val.sky) val.sky = '1';
      if (!val.pty) val.pty = '0';
      result.push(val as HourlyForecastItem);
    }
  });

  return result.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  }).slice(0, 24);
};
