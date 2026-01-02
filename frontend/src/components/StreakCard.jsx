import { useEffect, useRef, useState } from "react";
import { getProgressTheme } from "../utils/progressTheme";

export default function StreakCard({
  streak,
  bestStreak,
  progress,
  onClick,
}) {
  const theme = getProgressTheme(progress);

  const prevStreak = useRef(streak);
  const [animateStreak, setAnimateStreak] = useState(false);

  /* -------------------- STREAK ANIMATION -------------------- */
  useEffect(() => {
    if (streak > prevStreak.current) {
      setAnimateStreak(true);

      const timer = setTimeout(() => {
        setAnimateStreak(false);
      }, 600);

      return () => clearTimeout(timer);
    }

    prevStreak.current = streak;
  }, [streak]);

  useEffect(() => {
    prevStreak.current = streak;
  }, []);

  /* -------------------- HELPERS -------------------- */
  const getMessage = () => {
    if (progress === 0) return "Start your day";
    if (progress === 100) return "Perfect day 🎉";
    return "Keep going";
  };

  const RADIUS = 88;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  /* -------------------- UI -------------------- */
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6
                 flex flex-col items-center
                 cursor-pointer hover:shadow-lg transition"
    >
      {/* 🌟 GLOW BACKGROUND */}
      <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
        <div
          className={`absolute w-40 h-40 rounded-full blur-2xl
                      transition-all duration-500
                      ${theme.glow}
                      ${
                        animateStreak
                          ? "scale-110 opacity-100"
                          : "scale-100 opacity-70"
                      }`}
        />

        {/* 🔵 PROGRESS CIRCLE */}
        <svg className="w-full h-full -rotate-90 relative z-10">
          <circle
            cx="96"
            cy="96"
            r={RADIUS}
            strokeWidth="12"
            className="stroke-slate-200 fill-none"
          />
          <circle
            cx="96"
            cy="96"
            r={RADIUS}
            strokeWidth="12"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={
              CIRCUMFERENCE * (1 - progress / 100)
            }
            className={`fill-none transition-all duration-700 ${theme.stroke}`}
            strokeLinecap="round"
          />
        </svg>

        {/* 🎯 CENTER TEXT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className={`text-4xl font-bold ${theme.text}`}>
            {progress}%
          </span>
          <span className="text-sm text-slate-500 mt-1">
            {getMessage()}
          </span>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="flex gap-6 text-center">
        <div
          className={`transition-transform duration-300
                      ${
                        animateStreak
                          ? "scale-125 text-orange-600"
                          : "scale-100"
                      }`}
        >
          <p className="text-lg font-semibold">
            🔥 {streak}
          </p>
          <p className="text-xs text-slate-500">
            Current Streak
          </p>
        </div>

        <div>
          <p className="text-lg font-semibold">
            {bestStreak}
          </p>
          <p className="text-xs text-slate-500">
            Best Streak
          </p>
        </div>
      </div>
    </div>
  );
}
