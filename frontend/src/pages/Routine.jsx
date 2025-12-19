import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CalendarPopup from "../components/CalenderPopup.jsx";
import StreakCard from "../components/StreakCard.jsx";
import Confetti from "../components/Confetti.jsx";
import DayCompletedCard from "../components/DayCompletedCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

const API_BASE = "http://localhost:4000";


export default function Routine() {
  const navigate = useNavigate();

const [tasks, setTasks] = useState([]);
useEffect(() => {
  async function fetchRoutine() {
    try {
      const res = await fetch(`${API_BASE}/routine/active`);
      const routine = await res.json();

      const formattedTasks = routine.tasks.map((t, index) => ({
        id: index + 1,
        title: t.title,
        description: t.description || "",
        done: false,
      }));

      setTasks(formattedTasks);
      localStorage.setItem("routineTasks", JSON.stringify(formattedTasks));
    } catch (err) {
      console.error("Failed to fetch routine:", err);

      // fallback (offline / backend down)
      const cached = localStorage.getItem("routineTasks");
      if (cached) {
        setTasks(JSON.parse(cached));
      }
    }
  }

  fetchRoutine();
}, []);



  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("routineHistory");
    return saved ? JSON.parse(saved) : {};
  });

  const [lastDate, setLastDate] = useState(
    () => localStorage.getItem("routineLastDate") || ""
  );

  const [todayCompleted, setTodayCompleted] = useState(
    () => localStorage.getItem("routineTodayCompleted") === "true"
  );

  const [streak, setStreak] = useState(
    () => Number(localStorage.getItem("routineStreak")) || 0
  );

  const [bestStreak, setBestStreak] = useState(
    () => Number(localStorage.getItem("routineBestStreak")) || 0
  );

  const [showCalendar, setShowCalendar] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = Math.round((done / total) * 100);

  useEffect(() => {
    localStorage.setItem("routineTasks", JSON.stringify(tasks));
    localStorage.setItem("routineHistory", JSON.stringify(history));
    localStorage.setItem("routineLastDate", lastDate);
    localStorage.setItem(
      "routineTodayCompleted",
      todayCompleted ? "true" : "false"
    );
    localStorage.setItem("routineStreak", String(streak));
    localStorage.setItem("routineBestStreak", String(bestStreak));
  }, [tasks, history, lastDate, todayCompleted, streak, bestStreak]);

  function getDateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function todayKey() {
    return getDateKey(new Date());
  }

  function computeStreak(hist) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    let count = 0;

    while (true) {
      const key = getDateKey(d);
      if (hist[key] && hist[key].done >= hist[key].total) {
        count++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return count;
  }

  useEffect(() => {
    if (done === total && total > 0 && !todayCompleted) {
      const key = todayKey();
      setHistory((prev) => ({ ...prev, [key]: { done: total, total } }));
      setTodayCompleted(true);
      setShowConfetti(true);
    }
  }, [done, total, todayCompleted]);

  useEffect(() => {
    const key = todayKey();

    if (!lastDate) {
      setLastDate(key);
      return;
    }

    if (lastDate !== key) {
      setHistory((prev) => {
        const copy = { ...prev };
        if (!copy[lastDate]) {
          copy[lastDate] = { done, total };
        }
        const s = computeStreak(copy);
        setStreak(s);
        setBestStreak((b) => Math.max(b, s));
        return copy;
      });

     setTasks((prev) => prev.map((t) => ({ ...t, done: false })));
      setTodayCompleted(false);
      setLastDate(key);
    } else {
      const s = computeStreak(history);
      setStreak(s);
      setBestStreak((b) => Math.max(b, s));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleTask(id) {
    if (todayCompleted) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function restoreDay(dayKey) {
    setHistory((prev) => {
      const copy = { ...prev, [dayKey]: { done: total, total } };
      const s = computeStreak(copy);
      setStreak(s);
      setBestStreak((b) => Math.max(b, s));
      return copy;
    });
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100">
      <div className="max-w-6xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-1">
              Daily Routine Discipline
            </h1>
            <p className="text-slate-600 text-sm">
              Follow this routine every day to build long-term discipline.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-routine")}
            className="px-4 py-2 text-sm font-semibold rounded-lg
                       bg-blue-600 text-white hover:bg-blue-700
                       transition shadow-sm"
          >
            Create your own
          </button>
        </div>

        {/* DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-md relative overflow-hidden">
            <Confetti
              active={showConfetti}
              onDone={() => setShowConfetti(false)}
            />

            <h2 className="text-xl font-semibold mb-3">Today's Routine</h2>

            {!todayCompleted && (
              <div className="mb-4">
                <ProgressBar value={done} total={total} />
              </div>
            )}

            {todayCompleted ? (
              <DayCompletedCard />
            ) : (
              <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`px-3 py-2 rounded-lg border flex justify-between text-left transition ${
                      task.done
                        ? "bg-green-50 border-green-300"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <p
                        className={`font-semibold ${
                          task.done ? "line-through text-green-700" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {task.description}
                      </p>
                    </div>

                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full border transition ${
                        task.done
                          ? "bg-green-600 text-white border-green-600 scale-105"
                          : "border-slate-300"
                      }`}
                    >
                      {task.done ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <StreakCard
              streak={streak}
              bestStreak={bestStreak}
              progress={progress}
              done={done}
              total={total}
              onClick={() => setShowCalendar(true)}
            />
          </div>
        </div>

        {showCalendar && (
          <CalendarPopup
            onClose={() => setShowCalendar(false)}
            history={history}
            total={total}
            onRestore={restoreDay}
          />
        )}
      </div>
    </div>
  );
}
