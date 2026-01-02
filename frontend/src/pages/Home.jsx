import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div
      className="min-h-[calc(100vh-64px)]
                 bg-slate-100 dark:bg-slate-900
                 text-slate-800 dark:text-slate-100"
    >
      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Build discipline,{" "}
          <span className="text-blue-600 dark:text-blue-400">
            one day at a time
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-300
                      max-w-2xl mx-auto mb-8">
          The Habitry helps you stay consistent with simple daily routines,
          visual progress, and motivating streaks — without pressure.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/routine")}
            className="px-6 py-3 rounded-xl
                       bg-blue-600 text-white
                       font-semibold hover:bg-blue-700 transition"
          >
            {isLoggedIn ? "Go to Routine" : "Start as Guest"}
          </button>

          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-xl
                         border border-blue-600
                         text-blue-600 dark:text-blue-400
                         font-semibold
                         hover:bg-blue-600 hover:text-white
                         transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-white dark:bg-slate-800 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">
            How The Habitry Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-xl
                            bg-slate-50 dark:bg-slate-900">
              <p className="text-3xl mb-3">📝</p>
              <h3 className="font-semibold mb-2">
                Create a Routine
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Start with a simple daily routine or use the default one.
              </p>
            </div>

            <div className="p-6 rounded-xl
                            bg-slate-50 dark:bg-slate-900">
              <p className="text-3xl mb-3">✅</p>
              <h3 className="font-semibold mb-2">
                Complete Daily Tasks
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Mark tasks as done and track your daily progress visually.
              </p>
            </div>

            <div className="p-6 rounded-xl
                            bg-slate-50 dark:bg-slate-900">
              <p className="text-3xl mb-3">🔥</p>
              <h3 className="font-semibold mb-2">
                Build Streaks
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Stay consistent and watch your streaks grow over time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WHY */}
      <div className="py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">
            Why people use The Habitry
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-sm">
            {[
              "Guest friendly",
              "No pressure, no guilt",
              "Visual progress & streaks",
              "Simple & focused",
            ].map((text) => (
              <div
                key={text}
                className="bg-white dark:bg-slate-800
                           p-4 rounded-lg shadow-sm"
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="bg-blue-600 py-12 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          Start building discipline today
        </h2>

        <button
          onClick={() => navigate("/routine")}
          className="mt-2 px-6 py-3 rounded-xl
                     bg-white text-blue-600
                     font-semibold hover:bg-slate-100 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
