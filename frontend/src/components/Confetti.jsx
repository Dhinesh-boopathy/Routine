import { useEffect } from "react";

export default function Confetti({ active, onDone }) {
  if (!active) return null;

  const pieces = Array.from({ length: 30 });

  useEffect(() => {
    const t = setTimeout(() => {
      onDone?.();
    }, 1200);

    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {pieces.map((_, i) => (
        <span
          key={i}
          className="absolute top-0 w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: [
              "#22c55e", // green
              "#3b82f6", // blue
              "#eab308", // yellow
              "#ec4899", // pink
              "#a855f7", // purple
            ][i % 5],
            animationDelay: `${Math.random() * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}
