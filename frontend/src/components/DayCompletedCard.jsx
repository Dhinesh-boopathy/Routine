import { useEffect, useState } from "react";

export default function DayCompletedCard() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Circle */}
      <div
        className={`
          w-28 h-28 rounded-full
          flex items-center justify-center
          bg-green-100 border-4 border-green-500
          transition-all duration-500
          ${
            animate
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0"
          }
        `}
      >
        {/* Tick */}
        <svg
          className="w-14 h-14 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Text */}
      <p className="mt-5 text-lg font-semibold text-green-700 animate-pulse">
        You completed today 🎉
      </p>

      <p className="text-sm text-slate-500 mt-1">
        Consistency builds discipline.
      </p>
    </div>
  );
}
