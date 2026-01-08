export default function PageHeader({
  streak,
  onStreakClick,
  onCreate,
  isLoggedIn,
  onMonthly,
  onSummary,
}) {
  return (
    <div className="mb-6">
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* LEFT: TITLE */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Daily Discipline
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Small actions. Every day. No excuses.
          </p>
        </div>

        {/* RIGHT: ACTIONS */}
        <div
          className="
            flex items-center gap-2
            overflow-x-auto md:overflow-visible
            whitespace-nowrap
          "
        >
          {/* 📅 Monthly */}
          {isLoggedIn && (
            <button
              onClick={onMonthly}
              className="
                flex items-center justify-center
                px-3 py-2 rounded-full
                text-sm font-medium
                bg-indigo-50 dark:bg-indigo-900/20
                text-indigo-600 dark:text-indigo-400
                border border-indigo-300 dark:border-indigo-700
                hover:bg-indigo-100 dark:hover:bg-indigo-900/40
                transition
              "
            >
              <span className="md:hidden">📅</span>
              <span className="hidden md:inline">📅 Monthly</span>
            </button>
          )}

          {/* 📊 Summary */}
          {isLoggedIn && (
            <button
              onClick={onSummary}
              className="
                flex items-center justify-center
                px-3 py-2 rounded-full
                text-sm font-medium
                bg-emerald-50 dark:bg-emerald-900/20
                text-emerald-600 dark:text-emerald-400
                border border-emerald-300 dark:border-emerald-700
                hover:bg-emerald-100 dark:hover:bg-emerald-900/40
                transition
              "
            >
              <span className="md:hidden">📊</span>
              <span className="hidden md:inline">📊 Summary</span>
            </button>
          )}

          {/* 🔥 Streak */}
          <button
            onClick={onStreakClick}
            className={`
              flex items-center gap-1
              px-3 py-2 rounded-full
              text-sm font-semibold border transition
              ${
                streak > 0
                  ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-700"
              }
            `}
          >
            🔥 <span>{streak}</span>
            <span className="hidden md:inline">day streak</span>
          </button>

          {/* ➕ Create */}
          <button
            onClick={onCreate}
            className="
              flex items-center justify-center
              px-3 py-2 rounded-full
              bg-blue-600 text-white
              hover:bg-blue-700
              transition
            "
          >
            <span className="md:hidden">➕</span>
            <span className="hidden md:inline">Create routine</span>
          </button>
        </div>
      </div>
    </div>
  );
}
