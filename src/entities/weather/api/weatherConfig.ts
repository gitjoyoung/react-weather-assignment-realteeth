export const WEATHER_API_CONFIG = {
  BASE_URL: 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst',
  VILAGE_FCST_URL: 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst',
  SERVICE_KEY: import.meta.env.VITE_WEATHER_API_SERVICE_KEY,
  DEFAULT_PARAMS: {
    dataType: 'JSON',
    numOfRows: 1000,
    pageNo: 1,
  },
  DEFAULT_COORDS: {
    nx: 55,
    ny: 127,
    lat: 37.5665,
    lon: 126.9780,
  }
};
