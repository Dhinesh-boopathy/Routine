export default function SummaryStat({ title, value }) {
  return (
    <div
      className="bg-white dark:bg-slate-800
                 rounded-xl shadow-sm p-4 text-center
                 text-slate-800 dark:text-slate-100"
    >
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="text-2xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}
