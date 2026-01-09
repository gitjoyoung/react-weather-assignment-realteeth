import { Card } from '@/shared/ui/card';
import { AlertCircle } from 'lucide-react';
import type { LocationItem } from '@/entities/location/hooks/locationService';

interface WeatherErrorCardProps {
  location?: LocationItem;
  onRetry: () => void;
  onDelete?: () => void;
  isFavorite: boolean;
}

export function WeatherErrorCard({ location, onRetry, onDelete, isFavorite }: WeatherErrorCardProps) {
  return (
    <Card className="w-full max-w-[380px] h-[600px] rounded-[3.5rem] border border-red-500/20 bg-red-950/20 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 gap-6 relative overflow-hidden">
      {/* Red Glow Effect */}
      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.2)_0%,transparent_60%)] blur-2xl" />
      
      <div className="flex flex-col items-center gap-2 relative z-10">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white drop-shadow-md">해당 장소의 정보가<br/>제공되지 않습니다.</h3>
        <p className="text-white/60 text-sm">{location?.displayName}</p>
      </div>
      
      <div className="flex flex-col gap-3 w-full max-w-[200px] relative z-10">
        <button 
          onClick={onRetry}
          className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-100 font-bold transition-all active:scale-95 border border-red-500/20"
        >
          다시 시도
        </button>
        
        {isFavorite && onDelete && (
          <button 
            onClick={onDelete}
            className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-all active:scale-95"
          >
            이 지역 삭제
          </button>
        )}
      </div>
    </Card>
  );
}
