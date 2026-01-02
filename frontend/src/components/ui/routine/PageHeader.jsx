export default function PageHeader({
  streak,
  onStreakClick,
  onCreate,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold
                       text-slate-800 dark:text-slate-100">
          Daily Discipline
        </h1>

        <p className="text-slate-500 dark:text-slate-400
                      text-sm mt-1">
          Small actions. Every day. No excuses.
        </p>
      </div>

      {/* Right */}
      <div className="flex gap-3 items-center">
        {/* Streak */}
        <button
          onClick={onStreakClick}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition
            ${
              streak > 0
                ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-700"
            }`}
        >
          🔥 {streak} day streak
        </button>

        {/* Create */}
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-lg
                     bg-blue-600 text-white
                     hover:bg-blue-700
                     transition"
        >
          Create routine
        </button>
      </div>
    </div>
  );
}
