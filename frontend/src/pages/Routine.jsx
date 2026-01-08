import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import CalendarPopup from "../components/CalenderPopup.jsx";
import StreakCard from "../components/StreakCard.jsx";
import Confetti from "../components/Confetti.jsx";
import DayCompletedCard from "../components/DayCompletedCard.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

import RoutineHeader from "../components/ui/routine/PageHeader.jsx";
import RoutinePanel from "../components/ui/routine/Panel.jsx";
import TaskItem from "../components/ui/routine/TaskItem.jsx";
import GuestBanner from "../components/ui/routine/GuestBanner.jsx";

import { authFetch } from "../utils/authFetch";
import { API_BASE } from "../config/api";

export default function Routine() {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const isGuest = !isLoggedIn;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayCompleted, setTodayCompleted] = useState(false);

  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [hideGuestBanner, setHideGuestBanner] = useState(
    localStorage.getItem("hideGuestBanner") === "true"
  );

  const taskRefs = useRef({});

  const todayKey = () => new Date().toISOString().split("T")[0];
  const yesterdayKey = () =>
    new Date(Date.now() - 86400000).toISOString().split("T")[0];

  /* -------------------- GUEST HELPERS -------------------- */
  const dismissGuestBanner = () => {
    localStorage.setItem("hideGuestBanner", "true");
    setHideGuestBanner(true);
  };

  const getGuestProgress = () => {
    const raw = localStorage.getItem("guestProgress");
    return raw ? JSON.parse(raw) : {};
  };

  const saveGuestProgress = (doneTitles) => {
    const progress = getGuestProgress();
    progress[todayKey()] = doneTitles;
    localStorage.setItem("guestProgress", JSON.stringify(progress));
  };

  const getGuestStreak = () => {
    const raw = localStorage.getItem("guestStreak");
    if (!raw) return { current: 0, best: 0, lastDate: null };

    const data = JSON.parse(raw);
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem("guestStreak");
      return { current: 0, best: 0, lastDate: null };
    }
    return data;
  };

  const saveGuestStreak = (data) => {
    localStorage.setItem(
      "guestStreak",
      JSON.stringify({
        ...data,
        expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
      })
    );
  };

  /* -------------------- FETCH ROUTINE -------------------- */
  useEffect(() => {
    async function fetchRoutine() {
      try {
        let routine;

        if (isLoggedIn) {
          routine = await authFetch("/routine/active");
        } else {
          const res = await fetch(`${API_BASE}/routine/public/default`);
          routine = await res.json();
        }

        if (!routine?.tasks?.length) return;

        let formatted = routine.tasks.map((t, i) => ({
          id: i + 1,
          title: t.title,
          description: t.description || "",
          done: false,
        }));

        if (isGuest) {
          const saved = getGuestProgress()[todayKey()] || [];
          formatted = formatted.map((t) => ({
            ...t,
            done: saved.includes(t.title),
          }));

          if (saved.length === formatted.length && formatted.length > 0) {
            setTodayCompleted(true);
          }
        }

        if (isLoggedIn) {
          const progress = await authFetch("/progress/today");

          if (progress?.completedTaskIds?.length) {
            formatted = formatted.map((t) => ({
              ...t,
              done: progress.completedTaskIds.includes(t.id),
            }));

            if (progress.completedTaskIds.length === formatted.length) {
              setTodayCompleted(true);
            }
          }
        }

        setTasks(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoutine();
  }, [isLoggedIn]);

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    if (loading || todayCompleted) return;
    const firstIncomplete = tasks.find((t) => !t.done);
    if (!firstIncomplete) return;
    taskRefs.current[firstIncomplete.id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [tasks, loading, todayCompleted]);

  /* -------------------- STREAKS -------------------- */
  useEffect(() => {
    if (!isLoggedIn) return;
    authFetch("/progress/streaks")
      .then((d) => {
        setStreak(d.streak);
        setBestStreak(d.bestStreak);
      })
      .catch(console.error);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isGuest) return;
    const gs = getGuestStreak();
    setStreak(gs.current);
    setBestStreak(gs.best);
  }, [isGuest]);

  /* -------------------- PROGRESS -------------------- */
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  /* -------------------- TOGGLE TASK -------------------- */
  const toggleTask = (id) => {
    if (todayCompleted) return;

    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      );

      const completedTaskIds = updated
        .filter((t) => t.done)
        .map((t) => t.id);

      if (isGuest) {
        saveGuestProgress(
          updated.filter((t) => t.done).map((t) => t.title)
        );
      } else {
        authFetch("/progress/today", {
          method: "POST",
          body: JSON.stringify({
            date: todayKey(),
            completedTaskIds,
            total,
          }),
        });
      }

      return updated;
    });
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <RoutineHeader
          streak={streak}
          isLoggedIn={isLoggedIn}
          onStreakClick={() => isLoggedIn && setShowCalendar(true)}
          onCreate={() =>
            !isLoggedIn ? setShowLoginPopup(true) : navigate("/create-routine")
          }
          onMonthly={() => navigate("/monthly-sheet")}
          onSummary={() => navigate("/summary")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 📱 MOBILE: STREAK UNDER BUTTONS */}
          <div className="block lg:hidden">
            <StreakCard
              streak={streak}
              bestStreak={bestStreak}
              progress={progress}
              onClick={isLoggedIn ? () => setShowCalendar(true) : null}
            />
          </div>

          {/* 🧠 TASKS */}
          <div className="lg:col-span-2">
            <RoutinePanel>
              <Confetti
                active={showConfetti}
                onDone={() => setShowConfetti(false)}
              />

              <h2 className="text-xl font-semibold mb-4">
                Today’s Routine
              </h2>

              {!todayCompleted && total > 0 && (
                <ProgressBar value={done} total={total} />
              )}

              {loading ? (
                <p className="text-sm text-slate-500 mt-4">
                  Loading routine…
                </p>
              ) : todayCompleted ? (
                <DayCompletedCard />
              ) : (
                <div className="mt-4 max-h-[50vh] overflow-y-auto pr-1 space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      ref={(el) => (taskRefs.current[task.id] = el)}
                    >
                      <TaskItem
                        task={task}
                        onToggle={() => toggleTask(task.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </RoutinePanel>
          </div>

          {/* 🖥 DESKTOP: RIGHT COLUMN */}
          <div className="hidden lg:block space-y-4">
            {isGuest && !hideGuestBanner && (
              <GuestBanner
                onLogin={() => navigate("/login")}
                onDismiss={dismissGuestBanner}
              />
            )}

            <StreakCard
              streak={streak}
              bestStreak={bestStreak}
              progress={progress}
              onClick={isLoggedIn ? () => setShowCalendar(true) : null}
            />
          </div>
        </div>

        {isLoggedIn && showCalendar && (
          <CalendarPopup
            onClose={() => setShowCalendar(false)}
            total={total}
          />
        )}
      </div>
    </div>
  );
}
