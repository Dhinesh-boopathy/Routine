import { useState, useEffect } from "react";

export default function Home() {
  // Load from localStorage
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("streak")) || 0);
  const [bestStreak, setBestStreak] = useState(() => Number(localStorage.getItem("bestStreak")) || 0);
  const [todayAnswer, setTodayAnswer] = useState(() => localStorage.getItem("todayAnswer") || null);
  const [quote, setQuote] = useState(() => localStorage.getItem("quote") || "");

  const quotes = [
    "Small savings build big dreams.",
    "Discipline today, freedom tomorrow.",
    "Consistency beats motivation.",
    "Your future self will thank you.",
  ];

  function pickQuote() {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(q);
  }

  function handleAnswer(ans) {
    setTodayAnswer(ans);

    if (ans === "yes") {
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      pickQuote();
    } else {
      setStreak(0);
      setQuote("Streak broke. Start again tomorrow! 💪");
    }
  }

  // Save everything in localStorage
  useEffect(() => {
    localStorage.setItem("streak", streak);
    localStorage.setItem("bestStreak", bestStreak);
    localStorage.setItem("todayAnswer", todayAnswer || "");
    localStorage.setItem("quote", quote || "");
  }, [streak, bestStreak, todayAnswer, quote]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-4xl text-blue-600 font-bold">Daily Savings Streak</h2>

      {/* Streak Box */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-4">
        <p className="text-xl">
          Current Streak: <span className="font-bold">{streak} days</span>
        </p>
        <p className="text-sm text-gray-500">Best Streak: {bestStreak} days</p>
      </div>

      {/* Yes No Box */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-4">
        <p className="mb-2 text-lg">Did you save money today?</p>

        <div className="flex gap-4">
          <button
            onClick={() => handleAnswer("yes")}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Yes
          </button>

          <button
            onClick={() => handleAnswer("no")}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            No
          </button>
        </div>

        {quote && (
          <p className="mt-4 text-red-600 font-semibold">{quote}</p>
        )}
      </div>

      {/* Link to Savings Page (can be expanded later) */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold">Your Saving Goals</h3>
        <p className="text-gray-500">Create and manage your goals on the Savings page.</p>
      </div>
    </div>
  );
}
