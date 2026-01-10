import { cn } from '@/shared/lib/utils';
import { getSeasonTitle } from '../lib/seasonUtils';

interface SeasonalTitleProps {
  className?: string;
}

export function SeasonalTitle({ className }: SeasonalTitleProps) {
  const { title, subtitle } = getSeasonTitle();

  return (
    <div className={cn(
      "flex flex-col items-center gap-2 text-center transition-all duration-500",
      className
    )}>
      <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent drop-shadow-sm whitespace-nowrap">
        {title}
      </h1>
      <div className="flex items-center font-bold gap-2 text-sm uppercase tracking-[0.3em] opacity-60">
          {subtitle}
      </div>
    </div>
  );
}
