import { Search, X, Loader2, Navigation } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isFocused: boolean;
  isLoading: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  onDetect: (e: React.MouseEvent) => void;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  isFocused,
  isLoading,
  onKeyDown,
  onFocus,
  onDetect,
}: SearchInputProps) {
  return (
    <div className={cn(
      "relative flex items-center bg-white rounded-full transition-all duration-300",
      isFocused ? "ring-2 ring-primary shadow-xl rounded-3xl" : "shadow-lg"
    )}>
      <div className="pl-5 pr-3 text-muted-foreground">
        <Search className="w-5 h-5 " />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder="지역 이름 검색"
        className="flex-1 py-4 px-2 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-base"
      />

      <div className="mr-4 flex items-center gap-1">
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        ) : value ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        ) : (
          <button
            onClick={onDetect}
            className="p-2 rounded-full hover:bg-primary/10 text-gray-400 hover:text-primary transition-all group/nav"
            title="현재 위치로 검색"
          >
            <Navigation className="w-4 h-4 fill-current group-hover/nav:animate-pulse" />
          </button>
        )}
      </div>
    </div>
  );
}
