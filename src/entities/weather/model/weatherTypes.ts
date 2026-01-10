export interface HourlyWeatherData {
    dateTime: string;
    date: string;
    time: string;
    temp: number;
    sky?: string;
    pty?: string;
    humidity?: number;
    windSpeed?: number;
    isObservation: boolean;
    isCurrent: boolean;
}
