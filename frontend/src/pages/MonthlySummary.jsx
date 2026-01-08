import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch";

import SummaryStat from "../components/summary/SummaryStat";
import MonthlyCalendar from "../components/summary/MonthlyCalendar";

export default function MonthlySummary() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 1–12

    async function fetchMonth() {
      try {
        const res = await authFetch(
          `/progress/month?year=${year}&month=${month}`
        );

        // 🔑 Convert object → array
        const arr = Object.entries(res || {}).map(
          ([date, values]) => ({
            date,
            completed: values.completed,
            total: values.total,
          })
        );

        setData(arr);
      } catch (err) {
        console.error("Monthly summary fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMonth();
  }, [isLoggedIn, navigate]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        Loading monthly summary…
      </div>
    );
  }

  /* -------------------- CALCULATIONS -------------------- */

  // Days with at least one task done
  const daysActive = data.filter(d => d.completed > 0).length;

  // Total tasks completed in the month
  const tasksCompleted = data.reduce(
    (sum, d) => sum + d.completed,
    0
  );

  // Total tasks planned
  const totalPlanned = data.reduce(
    (sum, d) => sum + d.total,
    0
  );

  // Completion %
  const completionRate =
    totalPlanned === 0
      ? 0
      : Math.round((tasksCompleted / totalPlanned) * 100);

  // Longest streak (completed === total)
  let longestStreak = 0;
  let currentStreak = 0;

  const sorted = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  sorted.forEach(d => {
    if (d.total > 0 && d.completed === d.total) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  /* -------------------- UI -------------------- */

  return (
    <div
      className="min-h-[calc(100vh-64px)]
                 bg-slate-100 dark:bg-slate-900
                 text-slate-800 dark:text-slate-100"
    >
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div
          className="bg-white dark:bg-slate-800
                     rounded-xl p-5 shadow-sm"
        >
          <h1 className="text-2xl font-semibold">
            This Month at Habitry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No perfection. Just showing up.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryStat title="Days Active" value={daysActive} />
          <SummaryStat title="Tasks Completed" value={tasksCompleted} />
          <SummaryStat title="Completion Rate" value={`${completionRate}%`} />
          <SummaryStat title="Longest Streak" value={`${longestStreak} days`} />
        </div>

        {/* Calendar */}
        <MonthlyCalendar data={data} />

        {/* Footer message */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Consistency beats perfection. Keep going 💪
        </p>
      </div>
    </div>
  );
}
