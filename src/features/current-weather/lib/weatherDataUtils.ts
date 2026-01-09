import type { KmaWeatherItem } from '@/entities/weather/model/types';

export interface WeatherData {
  temp: string | undefined;
  sky: string | undefined;
  pty: string | undefined;
  humidity: string | undefined;
  windSpeed: string | undefined;
  tmn: string | undefined; // Daily Min Temp
  tmx: string | undefined; // Daily Max Temp
}

export const extractWeatherData = (data: KmaWeatherItem[]): WeatherData => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}${mm}${dd}`;

  // Helper to find value specifically for today
  const findValue = (category: string) => {
    // Try to find the closest forecast (UltraSrt or Vilage)
    // First, look for item with today's date
    let item = data.find(i => i.category === category && i.fcstDate === todayStr);
    if (!item) {
      // Fallback to closest available (could be tomorrow if now is late night)
      // But for current weather display, we accept the first available one as "current-ish"
      item = data.find(i => i.category === category);
    }
    return item?.fcstValue;
  };

  // Calculate High/Low manually using all hourly temperatures for TODAY
  const todaysTemps = data
    .filter(item => (item.category === 'T1H' || item.category === 'TMP') && item.fcstDate === todayStr)
    .map(item => parseFloat(item.fcstValue));

  let calculatedMin: string | undefined;
  let calculatedMax: string | undefined;

  if (todaysTemps.length > 0) {
    calculatedMin = String(Math.min(...todaysTemps));
    calculatedMax = String(Math.max(...todaysTemps));
  } else {
    // If no hourly data for today (unlikely), try to use API's TMN/TMX if matched today
    const apiMin = data.find(item => item.category === 'TMN' && item.fcstDate === todayStr);
    const apiMax = data.find(item => item.category === 'TMX' && item.fcstDate === todayStr);
    if (apiMin) calculatedMin = apiMin.fcstValue;
    if (apiMax) calculatedMax = apiMax.fcstValue;
  }

  // If still nothing and we are willing to show fallback (e.g. tomorrow's data if it's 23:59), 
  // maybe we shouldn't. Let's return undefined to show '--' instead of wrong info.

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

export interface HourlyForecastItem {
  date: string;
  time: string;
  temp: string;
  sky: string;
  pty: string;
}

export const extractHourlyForecast = (data: KmaWeatherItem[]): HourlyForecastItem[] => {
  const result: HourlyForecastItem[] = [];
  const now = new Date();
  const currentHour = now.getHours();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}${mm}${dd}`;

  // Consider data from now onwards
  // (We process items that have hourly temp T1H or TMP)

  // Group by (date + time)
  const grouped = new Map<string, Partial<HourlyForecastItem>>();

  data.forEach(item => {
    const key = `${item.fcstDate}-${item.fcstTime}`;

    // Strictly include ONLY today's data (00:00 ~ 23:59)
    if (item.fcstDate !== todayStr) return;

    if (!grouped.has(key)) {
      grouped.set(key, { date: item.fcstDate, time: item.fcstTime.substring(0, 2) + ':00' });
    }
    const current = grouped.get(key)!;

    // Prioritize T1H (UltraSrt) over TMP (Vilage)
    if (item.category === 'T1H') {
      current.temp = item.fcstValue; // Always overwrite with T1H (higher priority)
    } else if (item.category === 'TMP') {
      if (!current.temp) current.temp = item.fcstValue; // Only set if empty (don't overwrite T1H)
    }

    if (item.category === 'SKY') current.sky = item.fcstValue;
    if (item.category === 'PTY') current.pty = item.fcstValue;
  });

  // Convert map to array and sorting
  grouped.forEach((val) => {
    // Only require temp. Sky/PTY are optional for the simple table view.
    if (val.temp) {
      // Fill defaults if missing
      if (!val.sky) val.sky = '1'; // Default sunny/clear
      if (!val.pty) val.pty = '0'; // Default no rain
      result.push(val as HourlyForecastItem);
    }
  });

  return result.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  }).slice(0, 24); // Return next 24 hours
};
