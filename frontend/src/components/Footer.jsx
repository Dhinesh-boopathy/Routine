import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 border-t
                       bg-white dark:bg-slate-900
                       border-slate-200 dark:border-slate-700">
      <div
        className="max-w-6xl mx-auto px-6 py-6
                   flex flex-col md:flex-row
                   justify-between items-center gap-4"
      >
        {/* Brand */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold
                         text-blue-600 dark:text-blue-400">
            The Habitry
          </h3>

          <p className="text-sm
                        text-slate-500 dark:text-slate-400">
            Build discipline, one day at a time.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-slate-600 dark:text-slate-300
                       hover:text-blue-600 dark:hover:text-blue-400
                       transition-colors"
          >
            Home
          </Link>

          <Link
            to="/routine"
            className="text-slate-600 dark:text-slate-300
                       hover:text-blue-600 dark:hover:text-blue-400
                       transition-colors"
          >
            Routine
          </Link>

          <Link
            to="/contact"
            className="text-slate-600 dark:text-slate-300
                       hover:text-blue-600 dark:hover:text-blue-400
                       transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>

      <div
        className="text-center text-xs pb-4
                   text-slate-400 dark:text-slate-500"
      >
        © {new Date().getFullYear()} The Habitry. All rights reserved.
      </div>
    </footer>
  );
}
