import { useMemo } from "react";

export default function MonthlyTaskSheet({
  tasks = [],
  monthProgress = {},
  todayCompletedTaskIds = [], // 👈 DAILY source of truth
  onToggleTodayTask,
}) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const todayDate = today.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  function isToday(day) {
    return day === todayDate;
  }

  function isEditable(day) {
    return day === todayDate;
  }

  function getDateKey(day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  }

  /**
   * 🔑 SOURCE OF TRUTH LOGIC
   * - TODAY → task-level (daily state)
   * - PAST/FUTURE → summary only (no task-level info)
   */
  function isTaskDone(taskId, day) {
    if (day === todayDate) {
      return todayCompletedTaskIds.includes(taskId);
    }
    return false;
  }

  return (
    <div
      className="border rounded-xl overflow-hidden
                 bg-white dark:bg-slate-800
                 border-slate-200 dark:border-slate-700"
    >
      {/* 🌐 Horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="min-w-max border-collapse text-sm">
          {/* HEADER */}
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th
                className="sticky left-0 z-20
                           bg-slate-50 dark:bg-slate-700
                           p-2 border
                           border-slate-200 dark:border-slate-600
                           text-left min-w-[160px]"
              >
                Task
              </th>

              {days.map(day => (
                <th
                  key={day}
                  className={`p-2 border text-center min-w-[36px]
                    border-slate-200 dark:border-slate-600
                    ${
                      isToday(day)
                        ? "bg-blue-100 dark:bg-blue-900 font-bold"
                        : ""
                    }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                {/* TASK NAME */}
                <td
                  className="sticky left-0 z-10
                             bg-white dark:bg-slate-800
                             p-2 border
                             border-slate-200 dark:border-slate-600
                             font-medium
                             text-slate-800 dark:text-slate-100"
                >
                  {task.title}
                </td>

                {/* DAY CELLS */}
                {days.map(day => {
                  const editable = isEditable(day);
                  const checked = isTaskDone(task.id, day);

                  return (
                    <td
                      key={day}
                      className={`p-2 border text-center
                        border-slate-200 dark:border-slate-600
                        ${
                          !editable
                            ? "bg-slate-100 dark:bg-slate-900 text-slate-400"
                            : "bg-white dark:bg-slate-800"
                        }
                        ${
                          isToday(day)
                            ? "bg-blue-50 dark:bg-blue-950"
                            : ""
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={!editable}
                        onChange={() =>
                          editable && onToggleTodayTask(task.id)
                        }
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INFO */}
      <p className="text-xs text-slate-500 dark:text-slate-400 p-2">
        Only today is editable. Past and future days are locked.
      </p>
    </div>
  );
}
