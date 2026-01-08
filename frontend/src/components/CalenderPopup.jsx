import { useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch";

export default function CalendarPopup({ onClose, total = 0 }) {
  const today = new Date();

  const REAL_YEAR = today.getFullYear();
  const REAL_MONTH = today.getMonth();

  const [currentYear, setCurrentYear] = useState(REAL_YEAR);
  const [currentMonth, setCurrentMonth] = useState(REAL_MONTH);

  const [progressByDate, setProgressByDate] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState(null);
  const [actionMsg, setActionMsg] = useState("");

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "short" }
  );

  const isCurrentMonth =
    currentYear === REAL_YEAR && currentMonth === REAL_MONTH;

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    async function fetchMonthProgress() {
      setLoading(true);
      try {
        const data = await authFetch(
          `/progress/month?year=${currentYear}&month=${currentMonth + 1}`
        );
        setProgressByDate(data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMonthProgress();
  }, [currentYear, currentMonth]);

  /* ---------------- BUILD DAYS ---------------- */
  const dayData = [];
  let fullDays = 0;
  let daysTracked = 0;
  let sumRatio = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    const record = progressByDate[key];
    let ratio = 0;

    if (record && record.total > 0) {
      ratio = record.completed / record.total;
      sumRatio += ratio;
      daysTracked++;
      if (ratio >= 1) fullDays++;
    }

    dayData.push({ day, key, ratio });
  }

  const avgCompletion =
    daysTracked === 0 ? 0 : Math.round((sumRatio / daysTracked) * 100);

  /* ---------------- HELPERS ---------------- */
  const isFutureDate = (day) =>
    new Date(currentYear, currentMonth, day) > today;

  const isToday = (day) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const getDayClasses = (ratio, day) => {
    let base =
      "w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-semibold ";

    if (ratio >= 1) base += "bg-blue-600 text-white";
    else if (ratio > 0)
      base +=
        "bg-blue-100 text-blue-700 border border-blue-500 dark:bg-blue-900 dark:text-blue-200";
    else
      base +=
        "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300";

    if (isToday(day)) base += " ring-2 ring-blue-500";
    if (isFutureDate(day)) base += " opacity-40 cursor-not-allowed";

    return base;
  };

  /* ---------------- ACTIONS ---------------- */
  const openDay = (dayObj) => {
    if (isFutureDate(dayObj.day) || isToday(dayObj.day)) return;
    setSelectedDay(dayObj);
    setActionMsg("");
  };

  const handleRestore = async () => {
    if (!selectedDay) return;

    await authFetch("/progress", {
      method: "POST",
      body: JSON.stringify({
        date: selectedDay.key,
        completed: total,
        total,
      }),
    });

    setProgressByDate((prev) => ({
      ...prev,
      [selectedDay.key]: { completed: total, total },
    }));

    setActionMsg("Restored ✅");
    setTimeout(() => setSelectedDay(null), 600);
  };

  const goPrevMonth = () => {
    const prev = new Date(currentYear, currentMonth - 1);
    setCurrentYear(prev.getFullYear());
    setCurrentMonth(prev.getMonth());
    setSelectedDay(null);
  };

  const goNextMonth = () => {
    if (isCurrentMonth) return;
    const next = new Date(currentYear, currentMonth + 1);
    setCurrentYear(next.getFullYear());
    setCurrentMonth(next.getMonth());
    setSelectedDay(null);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 w-11/12 max-w-md p-4 sm:p-6 rounded-xl shadow-lg text-slate-900 dark:text-slate-100">
        {/* HEADER */}
        <div className="grid grid-cols-3 items-center mb-4">
          <button
            onClick={goPrevMonth}
            className="justify-self-start px-3 py-1.5 border rounded dark:border-slate-700"
          >
            ◀
          </button>

          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Month
            </p>
            <h3 className="text-lg font-bold">
              {monthName} {currentYear}
            </h3>
          </div>

          <div className="justify-self-end flex items-center gap-3">
            <button
              onClick={goNextMonth}
              disabled={isCurrentMonth}
              className={`px-3 py-1.5 border rounded dark:border-slate-700 ${
                isCurrentMonth ? "opacity-40" : ""
              }`}
            >
              ▶
            </button>
            <button
              onClick={onClose}
              className="text-red-500 text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading calendar…
          </p>
        ) : (
          <>
            {/* STATS */}
            <div className="flex justify-between mb-4 text-sm">
              {[
                ["Full Days", fullDays],
                ["Avg Completion", `${avgCompletion}%`],
                ["Days Tracked", daysTracked],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {label}
                  </p>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>

            {/* CALENDAR */}
            <div className="mx-auto w-[280px] sm:w-[320px]">
              <div className="grid grid-cols-7 place-items-center text-xs text-slate-400 mb-2">
                <span>S</span><span>M</span><span>T</span><span>W</span>
                <span>T</span><span>F</span><span>S</span>
              </div>

              <div className="grid grid-cols-7 place-items-center gap-2">
                {Array(firstDayOfMonth)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="w-9 h-9 sm:w-10 sm:h-10" />
                  ))}

                {dayData.map(({ day, ratio, key }) => (
                  <button
                    key={key}
                    onClick={() => openDay({ day, ratio, key })}
                    className={getDayClasses(ratio, day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              🔵 Full · 🔹 Partial · ⚪ No record · 🔒 Future locked
            </p>
          </>
        )}

        {/* RESTORE */}
        {selectedDay && (
          <div className="mt-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-md border dark:border-slate-700">
            <p className="text-sm font-semibold">
              Restore Day {selectedDay.day}?
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleRestore}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-semibold"
              >
                Mark as completed
              </button>
              <button
                onClick={() => setSelectedDay(null)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded text-sm"
              >
                Cancel
              </button>
            </div>
            {actionMsg && (
              <p className="mt-2 text-sm text-green-600">{actionMsg}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
