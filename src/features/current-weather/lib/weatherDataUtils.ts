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
  return {
    temp: data.find(item => item.category === 'T1H')?.fcstValue,
    sky: data.find(item => item.category === 'SKY')?.fcstValue,
    pty: data.find(item => item.category === 'PTY')?.fcstValue,
    humidity: data.find(item => item.category === 'REH')?.fcstValue,
    windSpeed: data.find(item => item.category === 'WSD')?.fcstValue,
    tmn: data.find(item => item.category === 'TMN')?.fcstValue,
    tmx: data.find(item => item.category === 'TMX')?.fcstValue,
  };
};
