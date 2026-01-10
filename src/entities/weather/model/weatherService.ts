import { fetchUltraSrtNcst, fetchUltraSrtFcst, fetchVilageFcst } from '../api/weatherApi';
import { getBaseDateTime, getVilageBaseDateTime, convertToGrid } from '../lib/weatherUtils';
import type { KmaWeatherItem } from './types';
import type { HourlyWeatherData } from './weatherTypes';

/**
 * 좌표 기반 날씨 데이터 조회 (기존 방식 - 호환성 유지)
 */
export async function getWeatherByCoords(lat: number, lon: number) {
    const { baseDate, baseTime } = getBaseDateTime();
    const { baseDate: vilageBaseDate, baseTime: vilageBaseTime } = getVilageBaseDateTime();
    const { nx, ny } = convertToGrid(lat, lon);

    const [currentItems, forecastItems] = await Promise.all([
        fetchUltraSrtNcst(baseDate, baseTime, nx, ny).catch((error) => {
            console.warn('초단기실황 조회 실패:', error);
            return [];
        }),
        fetchVilageFcst(vilageBaseDate, vilageBaseTime, nx, ny).catch((error) => {
            console.warn('단기예보 조회 실패:', error);
            return [];
        }),
    ]);

    return [...currentItems, ...forecastItems];
}

/**
 * 24시간 날씨 타임라인 조회
 * 현재 시각 기준 전후 12시간씩 총 24시간 데이터
 */
export async function get24HourWeatherTimeline(lat: number, lon: number): Promise<HourlyWeatherData[]> {
    const now = new Date();
    const currentHour = now.getHours();

    const { baseDate, baseTime } = getBaseDateTime();
    const { baseDate: vilageBaseDate, baseTime: vilageBaseTime } = getVilageBaseDateTime();
    const { nx, ny } = convertToGrid(lat, lon);

    const [ncstItems, fcstItems, vilageFcstItems] = await Promise.all([
        fetchUltraSrtNcst(baseDate, baseTime, nx, ny).catch(() => []),
        fetchUltraSrtFcst(baseDate, baseTime, nx, ny).catch(() => []),
        fetchVilageFcst(vilageBaseDate, vilageBaseTime, nx, ny).catch(() => []),
    ]);

    const allItems: KmaWeatherItem[] = [...ncstItems, ...fcstItems, ...vilageFcstItems];

    const startTime = new Date(now);
    startTime.setHours(currentHour - 6, 0, 0, 0);

    const endTime = new Date(now);
    endTime.setHours(currentHour + 18, 0, 0, 0);

    const timelineMap = new Map<string, Partial<HourlyWeatherData>>();

    for (let time = new Date(startTime); time <= endTime; time.setHours(time.getHours() + 1)) {
        const dateStr = formatDate(time);
        const timeStr = String(time.getHours()).padStart(2, '0') + '00';
        const key = `${dateStr}-${timeStr}`;

        const isPast = time < now;
        const isCurrent = time.getHours() === currentHour &&
            time.getDate() === now.getDate() &&
            time.getMonth() === now.getMonth();

        timelineMap.set(key, {
            dateTime: time.toISOString(),
            date: dateStr,
            time: timeStr,
            isObservation: isPast,
            isCurrent,
        });
    }

    allItems.forEach(item => {
        const key = `${item.fcstDate}-${item.fcstTime}`;
        const entry = timelineMap.get(key);
        if (!entry) return;

        if (item.category === 'T1H' || item.category === 'TMP') {
            if (!entry.temp || item.category === 'T1H') {
                entry.temp = parseFloat(item.fcstValue);
            }
        }
        if (item.category === 'SKY') entry.sky = item.fcstValue;
        if (item.category === 'PTY') entry.pty = item.fcstValue;
        if (item.category === 'REH') entry.humidity = parseFloat(item.fcstValue);
        if (item.category === 'WSD') entry.windSpeed = parseFloat(item.fcstValue);
    });

    const timeline: HourlyWeatherData[] = [];
    timelineMap.forEach((value) => {
        if (value.temp !== undefined) {
            timeline.push(value as HourlyWeatherData);
        }
    });

    return timeline.sort((a, b) => a.dateTime.localeCompare(b.dateTime));
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}
