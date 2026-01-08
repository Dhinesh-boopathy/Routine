import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch";
import MonthlyTaskSheet from "../components/monthly/MonthlyTaskSheet";

export default function MonthlyView() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [monthProgress, setMonthProgress] = useState({});
  const [todayCompletedTaskIds, setTodayCompletedTaskIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const todayKey = today.toISOString().split("T")[0];

  /* ---------- AUTH ---------- */
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  /* ---------- FETCH TASKS ---------- */
  useEffect(() => {
    async function fetchTasks() {
      try {
        const routine = await authFetch("/routine/active");
        if (!routine?.tasks?.length) return;

        setTasks(
          routine.tasks.map((t, i) => ({
            id: i + 1,
            title: t.title,
            description: t.description || "",
          }))
        );
      } catch (err) {
        console.error("Fetch tasks failed:", err);
      }
    }

    fetchTasks();
  }, []);

  /* ---------- FETCH MONTH SUMMARY ---------- */
  useEffect(() => {
    async function fetchMonth() {
      try {
        const res = await authFetch(
          `/progress/month?year=${year}&month=${month}`
        );
        setMonthProgress(res || {});
      } catch (err) {
        console.error("Fetch month failed:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMonth();
  }, [year, month]);

  /* ---------- FETCH TODAY (TASK-LEVEL) ---------- */
  useEffect(() => {
    async function fetchToday() {
      try {
        const res = await authFetch("/progress/today");
        setTodayCompletedTaskIds(res?.completedTaskIds || []);
      } catch (err) {
        console.error("Fetch today failed:", err);
      }
    }

    fetchToday();
  }, []);

  /* ---------- TOGGLE TODAY TASK ---------- */
  async function handleToggleTodayTask(taskId) {
    const updatedIds = todayCompletedTaskIds.includes(taskId)
      ? todayCompletedTaskIds.filter(id => id !== taskId)
      : [...todayCompletedTaskIds, taskId];

    await authFetch("/progress/today", {
      method: "POST",
      body: JSON.stringify({
        date: todayKey,
        completedTaskIds: updatedIds,
        total: tasks.length,
      }),
    });

    setTodayCompletedTaskIds(updatedIds);

    // Update monthly summary visually
    setMonthProgress(prev => ({
      ...prev,
      [todayKey]: {
        completed: updatedIds.length,
        total: tasks.length,
      },
    }));
  }

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="p-6 text-center text-slate-500">
        Loading monthly tasks…
      </div>
    );
  }

  /* ---------- UI ---------- */
return (
  <div className="min-h-[calc(100vh-64px)] bg-slate-100 dark:bg-slate-900">
    <div className="w-full mx-auto px-2 md:px-4 space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 mt-5 rounded-xl px-4 py-3 shadow-sm">
        <h1 className="text-2xl font-semibold">Monthly Task Sheet</h1>
        <p className="text-sm text-slate-500">
          Edit today. Review the rest.
        </p>
      </div>

      {/* Sheet */}
      <MonthlyTaskSheet
        tasks={tasks}
        monthProgress={monthProgress}
        todayCompletedTaskIds={todayCompletedTaskIds}
        onToggleTodayTask={handleToggleTodayTask}
      />
    </div>
  </div>
);


}
