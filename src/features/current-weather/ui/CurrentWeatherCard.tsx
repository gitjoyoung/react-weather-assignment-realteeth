import { useState, useCallback, memo } from "react";
import type { LocationItem } from "@/entities/location/hooks/locationService";
import { Card, CardContent } from "@/shared/ui/card";
import { Wind, Droplets, Star, Edit2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useWeatherCard } from "../hooks/useWeatherCard";
import { useWeather } from "../hooks/useWeatherQuery";
import { extractWeatherDataFromTimeline } from "@/entities/weather/lib/weatherDataUtils";
import { getPtyStyle, getSkyStyle } from "../lib/weatherStyles";
import { WeatherErrorCard } from "./WeatherErrorCard";
import { HourlyForecast } from "./HourlyForecast";
import { getCurrentDateTime } from "../lib/dateUtils";
import { getBaseDateTime } from "@/entities/weather/lib/weatherUtils";
import { LoadingGameCard } from "./LoadingGameCard";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface CurrentWeatherCardProps {
  location?: LocationItem;
}

export const CurrentWeatherCard = memo(function CurrentWeatherCard({
  location,
}: CurrentWeatherCardProps) {
  // 전역 상태 관리 (useWeatherCard 훅 사용)
  const { isFavorite, canAddFavorite, toggleFavorite, updateCustomName } =
    useWeatherCard(location!);

  // 로컬 상태
  const [tempName, setTempName] = useState(
    location?.customTitle || location?.displayName || ""
  );
  const [isGameFinished, setIsGameFinished] = useState(false);

  // 날씨 데이터
  const { data, isLoading, isError, refetch } = useWeather(
    location?.lat || 0,
    location?.lon || 0
  );

  // 공용 유틸로 날짜 및 기준시각 조회
  const { dateText } = getCurrentDateTime();
  const { baseTime } = getBaseDateTime();
  const inquiryTime = `${baseTime.substring(0, 2)}:${baseTime.substring(2, 4)}`;

  // 커스텀 네임 저장 핸들러
  const saveName = useCallback(() => {
    if (!location) return;
    const trimmed = tempName.trim();

    // 즐겨찾기된 항목만 커스텀 네임 변경 가능
    if (isFavorite && trimmed) {
      updateCustomName(trimmed);
    }
  }, [location, tempName, isFavorite, updateCustomName]);

  // Enter 키 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        saveName();
        e.currentTarget.blur();
      }
    },
    [saveName]
  );

  // 즐겨찾기 토글 핸들러 (최대 개수 확인 포함)
  const handleToggleFavorite = useCallback(() => {
    if (!location) return;

    if (!isFavorite && !canAddFavorite) {
      const confirmReplace = window.confirm(
        "즐겨찾기가 6개로 가득 찼습니다. 가장 예전에 추가한 지역을 삭제하고 이 지역을 추가하시겠습니까?"
      );
      if (!confirmReplace) return;
    }

    toggleFavorite();
  }, [location, isFavorite, canAddFavorite, toggleFavorite]);

  // 게임 완료 전이거나 로딩 중일 때 표시
  if (!isGameFinished) {
    // 로딩 중이 아닐 때만 데이터 추출 시도
    const weatherData = data ? extractWeatherDataFromTimeline(data) : null;

    return (
      <LoadingGameCard
        isDataReady={!!data && !isLoading}
        actualTemp={weatherData?.temp ? Number(weatherData.temp) : undefined}
        locationName={location?.displayName}
        onFinish={() => setIsGameFinished(true)}
      />
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <WeatherErrorCard
        location={location}
        onRetry={() => refetch()}
        onDelete={toggleFavorite}
        isFavorite={isFavorite}
      />
    );
  }

  const weatherData = extractWeatherDataFromTimeline(data || []);
  const weatherStyle =
    getPtyStyle(weatherData.pty) ?? getSkyStyle(weatherData.sky);
  const { bg, label, icon, shadow } = weatherStyle;

  return (
    <Card
      className={cn(
        "w-full max-w-[380px] min-h-[600px] h-auto rounded-[3.5rem] border-none text-white relative overflow-hidden transition-all duration-700 group",
        "bg-gradient-to-b shadow-2xl",
        bg,
        shadow
      )}
    >
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4)_0%,transparent_50%)] animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-20%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2)_0%,transparent_50%)] animate-bounce-subtle" />

      <CardContent className="h-full flex flex-col items-center justify-between relative z-10 p-2">
        <div className="w-full flex items-center justify-between px-4">
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-full transition-all duration-500 border bg-white/5 border-white/10 hover:bg-white/15 group/title-box",
                  !isFavorite ? "cursor-pointer active:scale-95" : "cursor-auto"
                )}
              >
                <input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={handleKeyDown}
                  disabled={!isFavorite}
                  className={cn(
                    "bg-transparent border-none outline-none text-base font-bold text-white transition-all duration-300 px-1 py-0.5 w-full truncate",
                    "placeholder:text-white/30 text-left",
                    isFavorite
                      ? "cursor-pointer focus:cursor-text"
                      : "pointer-events-none opacity-60"
                  )}
                  placeholder={
                    isFavorite ? "커스텀 타이틀" : "즐겨찾기 후 편집 가능"
                  }
                  title={
                    isFavorite
                      ? "클릭하여 편집"
                      : "즐겨찾기된 항목만 편집 가능합니다"
                  }
                />
                {isFavorite && (
                  <Edit2 className="w-2.5 h-2.5 opacity-80 group-hover/title-box:opacity-100 transition-opacity shrink-0 ml-1" />
                )}
              </div>
            </PopoverTrigger>
            {!isFavorite && (
              <PopoverContent
                side="top"
                align="center"
                sideOffset={8}
                className="w-auto px-4 py-2.5 bg-white text-slate-900 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-none animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200 z-[100]"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold tracking-tight">
                    즐겨찾기를 하면 태그를 지정할 수 있습니다.
                  </span>
                </div>
                {/* 말꼬리(Arrow) 추가 */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
              </PopoverContent>
            )}
          </Popover>

          <button
            onClick={handleToggleFavorite}
            className={cn(
              "p-1.5 transition-all duration-300 hover:scale-125 shrink-0",
              isFavorite
                ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                : "text-white/30 hover:text-white/90"
            )}
            title={
              isFavorite
                ? "즐겨찾기 제거"
                : canAddFavorite
                ? "즐겨찾기 추가"
                : "즐겨찾기 가득참 (교체)"
            }
          >
            <Star className={cn("w-5 h-5", isFavorite && "fill-current")} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 mt-2">
          <h3 className="text-2xl font-black tracking-tight drop-shadow-sm">
            {label}
          </h3>
          <p className="text-sm font-semibold opacity-80">
            {location?.displayName || "위치 정보 없음"}
          </p>
        </div>

        <div className="relative group/icon-area">
          <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full scale-150 group-hover/icon-area:scale-175 transition-transform duration-1000" />
          <div className="relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-float">
            {icon}
          </div>
        </div>

        <div className="flex flex-col items-center gap-0">
          <div className="flex items-start">
            <span className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter drop-shadow-lg leading-none">
              {weatherData.temp || "--"}
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-black mt-2 sm:mt-3 md:mt-4 ml-1">
              °
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-sm font-bold opacity-80">
            <span className="flex items-center gap-1">
              <span className="text-blue-300">▼</span>
              {weatherData.tmn ? Math.round(Number(weatherData.tmn)) : "--"}°
            </span>
            <span className="w-[1px] h-3 bg-white/30" />
            <span className="flex items-center gap-1">
              <span className="text-red-300">▲</span>
              {weatherData.tmx ? Math.round(Number(weatherData.tmx)) : "--"}°
            </span>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-sm font-black uppercase tracking-widest opacity-60">
                풍속
              </span>
              <span className="text-sm font-bold flex items-center gap-1">
                <Wind className="w-3 h-3" />
                {weatherData.windSpeed}m/s
              </span>
            </div>
            <div className="w-[1px] h-6 bg-white/20" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-black uppercase tracking-widest opacity-60">
                습도
              </span>
              <span className="text-sm font-bold flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                {weatherData.humidity}%
              </span>
            </div>
          </div>
        </div>

        <div className="w-full mt-4">
          <HourlyForecast data={data || []} />

          <div className="flex items-center justify-center gap-1.5 mt-3 opacity-60">
            <span className="text-[10px] font-bold tracking-tight">
              {dateText}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
            <span className="text-[9px] font-medium opacity-80">
              기상청 {inquiryTime} 발표 데이터
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
