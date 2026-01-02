export default function TaskItem({ task, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex justify-between items-start
                  p-4 rounded-xl border transition
                  ${
                    task.done
                      ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
    >
      <div className="text-left">
        <p
          className={`font-medium ${
            task.done
              ? "line-through text-green-700 dark:text-green-400"
              : "text-slate-800 dark:text-slate-100"
          }`}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {task.description}
          </p>
        )}
      </div>

      <div
        className={`w-6 h-6 flex items-center justify-center
                    rounded-full border text-sm
                    ${
                      task.done
                        ? "bg-green-600 text-white border-green-600"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
      >
        {task.done && "✓"}
      </div>
    </button>
  );
}
