import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-6xl mx-auto px-6 py-6
                      flex flex-col md:flex-row
                      justify-between items-center gap-4">

        {/* Brand */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold text-blue-600">
            The Habitry
          </h3>
          <p className="text-sm text-slate-500">
            Build discipline, one day at a time.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/routine" className="hover:text-blue-600">
            Routine
          </Link>
          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 pb-4">
        © {new Date().getFullYear()} The Habitry. All rights reserved.
      </div>
    </footer>
  );
}
