import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

export interface WeatherStyle {
  bg: string;
  label: string;
  icon: React.ReactElement;
  shadow: string;
}

export const getPtyStyle = (pty: string | undefined): WeatherStyle | null => {
  switch (pty) {
    case "1":
    case "5":
    case "6":
      return {
        bg: "from-blue-600 via-indigo-700 to-slate-900",
        label: "비",
        icon: <CloudRain className="w-40 h-40 text-blue-200" />,
        shadow: "shadow-blue-500/50"
      };
    case "2":
    case "3":
    case "7":
      return {
        bg: "from-cyan-200 via-blue-300 to-indigo-400",
        label: "눈",
        icon: <CloudSnow className="w-40 h-40 text-white" />,
        shadow: "shadow-cyan-500/50"
      };
    case "4":
      return {
        bg: "from-indigo-900 via-purple-900 to-black",
        label: "소나기",
        icon: <CloudLightning className="w-40 h-40 text-yellow-400" />,
        shadow: "shadow-purple-500/50"
      };
    default:
      return null;
  }
};

export const getSkyStyle = (sky: string | undefined): WeatherStyle => {
  switch (sky) {
    case "1":
      return {
        bg: "from-sky-400 via-blue-500 to-indigo-600",
        label: "맑음",
        icon: <Sun className="w-40 h-40 text-yellow-300 animate-spin-slow" />,
        shadow: "shadow-sky-400/50"
      };
    case "3":
      return {
        bg: "from-blue-400 via-blue-500 to-slate-400",
        label: "구름많음",
        icon: <Cloud className="w-40 h-40 text-blue-100" />,
        shadow: "shadow-blue-400/50"
      };
    case "4":
    default:
      return {
        bg: "from-slate-400 via-gray-500 to-slate-700",
        label: "흐림",
        icon: <Cloud className="w-40 h-40 text-gray-200" />,
        shadow: "shadow-slate-500/50"
      };
  }
};
