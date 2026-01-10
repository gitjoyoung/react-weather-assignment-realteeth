import { useState } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Plus, Minus, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingGameCardProps {
  isDataReady: boolean;
  actualTemp?: number;
  onFinish: () => void;
  locationName?: string;
}

type GameStatus = "idle" | "checking" | "success" | "fail";

export function LoadingGameCard({
  isDataReady,
  actualTemp,
  onFinish,
  locationName,
}: LoadingGameCardProps) {
  const [guess, setGuess] = useState(0);
  const [sign, setSign] = useState<1 | -1>(-1);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleGuess = (delta: number) => {
    if (status !== "idle") return;
    setGuess((prev) => Math.max(0, prev + delta));
  };

  const checkAnswer = () => {
    if (!isDataReady || actualTemp === undefined) return;

    const signedGuess = guess * sign;
    const target = Math.round(actualTemp);
    setStatus("checking");

    setTimeout(() => {
      if (signedGuess === target) {
        setStatus("success");
      } else {
        setStatus("fail");
      }

      // 결과 보여준 후 전환
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(onFinish, 500);
      }, 1800);
    }, 800);
  };

  return (
    <Card
      className={cn(
        "w-full max-w-[380px] min-h-[600px] h-auto rounded-[3.5rem] border-none flex items-center justify-center shadow-2xl transition-all duration-700 overflow-hidden relative",
        "bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/5",
        isTransitioning && "opacity-0 scale-95 blur-xl"
      )}
    >
      {/* Background Glow during results */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-500 blur-[100px]"
          />
        )}
        {status === "fail" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-500 blur-[100px]"
          />
        )}
      </AnimatePresence>

      <CardContent className="flex flex-col items-center justify-center gap-10 p-8 w-full z-10 h-full min-h-[500px]">
        <AnimatePresence mode="wait">
          {status === "idle" || status === "checking" ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              className="flex flex-col items-center gap-10 w-full"
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-2 px-6 text-2xl font-black text-white text-center">
                <h2> {locationName}</h2>
                <h2 className=" tracking-tight  break-keep">
                  지금 몇 도일까요?
                </h2>
              </div>

              {/* Game Area */}
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Sign Toggle */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setSign(-1)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                      sign === -1
                        ? "bg-blue-500 text-white shadow-lg"
                        : "text-white/40 hover:text-white/60"
                    )}
                  >
                    영하
                  </button>
                  <button
                    onClick={() => setSign(1)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                      sign === 1
                        ? "bg-red-500 text-white shadow-lg"
                        : "text-white/40 hover:text-white/60"
                    )}
                  >
                    영상
                  </button>
                </div>

                <div className="flex items-center gap-8">
                  <button
                    onClick={() => handleGuess(-1)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-90"
                    disabled={status !== "idle"}
                  >
                    <Minus className="w-6 h-6" />
                  </button>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <div className="relative w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-5xl font-black text-white tabular-nums flex items-start">
                        {sign === -1 && (
                          <span className="text-3xl mt-1.5 mr-0.5 opacity-60">
                            -
                          </span>
                        )}
                        {guess}
                        <span className="text-2xl mt-1.5 ml-0.5 opacity-60">
                          °
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGuess(1)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-90"
                    disabled={status !== "idle"}
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Footer/Action */}
              <div className="w-full px-4">
                <button
                  onClick={checkAnswer}
                  disabled={!isDataReady || status !== "idle"}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
                    !isDataReady
                      ? "bg-white/5 text-white/20 cursor-wait"
                      : "bg-white text-black hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5",
                    status === "checking" && "opacity-0 pointer-events-none"
                  )}
                >
                  {status === "checking" ? (
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" />
                    </div>
                  ) : isDataReady ? (
                    <>
                      정답 확인
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce" />
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                },
              }}
              className="flex flex-col items-center gap-6"
            >
              {status === "success" ? (
                <>
                  <motion.div
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-green-500 blur-3xl opacity-50 scale-150" />
                    <CheckCircle2 className="w-32 h-32 text-green-400 relative drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-4xl font-black text-white">
                      Perfect!
                    </span>
                    <span className="text-green-400/80 font-bold uppercase tracking-widest text-sm">
                      정답입니다!
                    </span>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-red-500 blur-3xl opacity-30 scale-125" />
                    <XCircle className="w-32 h-32 text-red-400 relative drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-4xl font-black text-white">
                      Oops!
                    </span>
                    <span className="text-red-400/80 font-bold uppercase tracking-widest text-sm">
                      기온은 {Math.round(actualTemp || 0)}°였습니다.
                    </span>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
