export default function Panel({ children }) {
  return (
    <div
      className="bg-white dark:bg-slate-800
                 text-slate-800 dark:text-slate-100
                 rounded-2xl shadow-sm p-5"
    >
      {children}
    </div>
  );
}
