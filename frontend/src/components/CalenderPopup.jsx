import { useState } from "react";

export default function CalendarPopup({ onClose, history = {}, total = 0, onRestore }) {
  const today = new Date();
  const year = today.getFullYear();
  const monthIndex = today.getMonth(); // 0–11
  const monthName = today.toLocaleString("default", { month: "short" });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const todayDate = today.getDate();

  // build day data
  const dayData = [];
  let fullDays = 0;
  let daysWithAnyRecord = 0;
  let sumRatio = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const record = history[key];
    let ratio = 0;
    if (record && record.total > 0) {
      ratio = record.done / record.total;
      sumRatio += ratio;
      daysWithAnyRecord++;
      if (ratio >= 1) fullDays++;
    }
    dayData.push({ day, ratio, key, record });
  }

  const completionRate =
    daysWithAnyRecord === 0
      ? 0
      : Math.round((sumRatio / daysWithAnyRecord) * 100);

  // Small internal state for the "restore" prompt
  const [selectedDay, setSelectedDay] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  function openDay(dayObj) {
    setSelectedDay(dayObj);
    setActionMsg("");
  }

  function closeDay() {
    setSelectedDay(null);
    setActionMsg("");
  }

  function handleRestore() {
    if (!selectedDay) return;
    if (onRestore && typeof onRestore === "function") {
      onRestore(selectedDay.key);
      setActionMsg("Restored ✅");
      // Also update selectedDay.record locally so UI reflects change until parent re-renders
      selectedDay.record = { done: total, total };
      // close after a short delay
      setTimeout(() => {
        closeDay();
      }, 700);
    }
  }

  function getDayClasses(day, ratio, isToday) {
    let base =
      "w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold ";

    if (ratio >= 1) {
      base += "bg-blue-600 text-white";
    } else if (ratio > 0) {
      base += "bg-blue-100 text-blue-700 border border-blue-500";
    } else {
      base += "bg-slate-200 text-slate-600";
    }

    if (isToday) {
      base += " ring-2 ring-blue-500";
    }

    return base;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 max-w-md p-6 rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-slate-500">Month</p>
            <h3 className="text-xl font-bold">
              {monthName} {year}
            </h3>
          </div>

          <button onClick={onClose} className="text-red-500 font-semibold text-sm">
            Close
          </button>
        </div>

        {/* Monthly stats */}
        <div className="flex justify-between mb-4 text-sm">
          <div>
            <p className="text-xs text-slate-500">Full Routine Days</p>
            <p className="text-lg font-semibold">{fullDays}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg Completion</p>
            <p className="text-lg font-semibold">{completionRate}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Days Tracked</p>
            <p className="text-lg font-semibold">{daysWithAnyRecord}</p>
          </div>
        </div>

        {/* Week header */}
        <div className="grid grid-cols-7 text-center text-xs text-slate-400 mb-2">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2 text-center mb-2">
          {dayData.map(({ day, ratio, key, record }) => {
            const isToday = day === todayDate;
            return (
              <div key={key} className="flex justify-center">
                <button
                  onClick={() =>
                    openDay({ day, ratio, key, record })
                  }
                  className={getDayClasses(day, ratio, isToday)}
                >
                  {day}
                </button>
              </div>
            );
          })}
        </div>

        {/* Info text */}
        <p className="mt-3 text-xs text-slate-500">
          🔵 Blue = day you completed the full routine. Light blue = partially
          done. Grey = no routine logged. Click a day to mark it as completed (if
          you actually finished but forgot to mark).
        </p>

        {/* Selected day panel */}
        {selectedDay && (
          <div className="mt-4 bg-slate-50 p-3 rounded-md border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold">
                  Day {selectedDay.day}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedDay.record
                    ? `Recorded: ${selectedDay.record.done}/${selectedDay.record.total}`
                    : "No record for this day"}
                </p>
              </div>

              <div className="text-right">
                {selectedDay.record && selectedDay.record.done >= selectedDay.record.total ? (
                  <p className="text-green-600 font-semibold text-sm">Completed ✅</p>
                ) : (
                  <p className="text-sm text-slate-500">Not completed</p>
                )}
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleRestore}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold"
              >
                I completed this day
              </button>

              <button
                onClick={closeDay}
                className="px-3 py-1 bg-slate-200 text-slate-800 rounded text-sm"
              >
                Cancel
              </button>
            </div>

            {actionMsg && <p className="mt-2 text-sm text-green-600">{actionMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
