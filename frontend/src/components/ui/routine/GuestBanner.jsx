export default function GuestBanner({ onLogin, onDismiss }) {
  return (
    <div
      className="bg-blue-50 dark:bg-blue-900/20
                 border border-blue-200 dark:border-blue-800
                 rounded-xl p-4 text-sm"
    >
      <div className="flex justify-between gap-2">
        <p className="text-slate-700 dark:text-slate-200">
          👋 <span className="font-semibold">Guest mode</span>
          <br />
          Login to save streaks & history.
        </p>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600
                     dark:hover:text-slate-300"
        >
          ✕
        </button>
      </div>

      <button
        onClick={onLogin}
        className="mt-3 w-full py-2 rounded-lg
                   bg-blue-600 text-white font-semibold
                   hover:bg-blue-700 transition"
      >
        Login to save progress
      </button>
    </div>
  );
}
