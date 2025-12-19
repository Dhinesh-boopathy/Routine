import { getProgressTheme } from "../utils/progressTheme";

export default function ProgressBar({ value, total }) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  // ✅ Single source of truth
  const theme = getProgressTheme(percentage);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-xs text-slate-500">
        <span>Progress</span>
        <span>{percentage}%</span>
      </div>

      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${theme.bar} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
