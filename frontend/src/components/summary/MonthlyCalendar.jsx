export default function MonthlyCalendar({ data }) {
  return (
    <div
      className="bg-white dark:bg-slate-800
                 rounded-xl shadow-sm p-4"
    >
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        Monthly Overview
      </p>

      <div className="grid grid-cols-7 gap-2">
        {data.map(d => (
          <div
            key={d.date}
            title={d.date}
            className={`h-8 rounded
              ${
                d.completed > 0
                  ? "bg-blue-600 dark:bg-blue-500"
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
