import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/routine");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
                 bg-slate-100 dark:bg-slate-900"
    >
      <div className="w-full max-w-md">
        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800
                     rounded-2xl shadow-lg p-8
                     text-slate-800 dark:text-slate-100"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Login to continue your discipline journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-4 text-sm
                         text-red-700 dark:text-red-400
                         bg-red-50 dark:bg-red-900/20
                         border border-red-200 dark:border-red-800
                         rounded-lg px-3 py-2 text-center"
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1
                         text-slate-700 dark:text-slate-300"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg
                         border border-slate-300 dark:border-slate-600
                         bg-white dark:bg-slate-900
                         text-slate-800 dark:text-slate-100
                         placeholder-slate-400 dark:placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-1
                         text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg
                         border border-slate-300 dark:border-slate-600
                         bg-white dark:bg-slate-900
                         text-slate-800 dark:text-slate-100
                         placeholder-slate-400 dark:placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Logging in…" : "Login"}
          </button>

          {/* Footer */}
          <p
            className="mt-6 text-sm text-center
                       text-slate-600 dark:text-slate-400"
          >
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400
                         font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </form>

        {/* Quote */}
        <p
          className="mt-6 text-xs text-center
                     text-slate-400 dark:text-slate-500"
        >
          “Discipline is choosing what you want most over what you want now.”
        </p>
      </div>
    </div>
  );
}
