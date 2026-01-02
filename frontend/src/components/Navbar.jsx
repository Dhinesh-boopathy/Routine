import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "../components/ui/ThemeToggle.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  /* -------------------- SYNC USER -------------------- */
  function syncUser() {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }

  useEffect(() => {
    syncUser();
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleStorageChange() {
      syncUser();
    }
    window.addEventListener("storage", handleStorageChange);
    return () =>
      window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* -------------------- CLICK OUTSIDE -------------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  /* -------------------- LOCK SCROLL (MOBILE) -------------------- */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  /* -------------------- ACTIVE LINK -------------------- */
  function navLinkClass(path) {
    const active = location.pathname === path;

    return `
      ${active ? "text-blue-600 font-semibold" : ""}
      text-slate-700 dark:text-slate-300
      hover:text-blue-600
      transition
    `;
  }

  /* -------------------- UI -------------------- */
  return (
    <>
      {/* Backdrop */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden" />
      )}

      <nav
        className="relative z-50 px-4 sm:px-6 py-3
                   bg-white dark:bg-slate-900
                   border-b border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Brand */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-bold
                       text-blue-600"
          >
            The Habitry
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link to="/" className={navLinkClass("/")}>Home</Link>
            <Link to="/routine" className={navLinkClass("/routine")}>Routine</Link>
            <Link to="/contact" className={navLinkClass("/contact")}>Contact</Link>

            <ThemeToggle />

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg border border-blue-600
                             text-blue-600 hover:bg-blue-600
                             hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg bg-blue-600
                             text-white hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Hi,{" "}
                  <span className="font-semibold">
                    {user.name || user.email || "User"}
                  </span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-500
                             text-white hover:bg-red-600
                             text-sm transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden text-2xl text-slate-700 dark:text-slate-200"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out
            ${menuOpen ? "max-h-96 mt-4 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="flex flex-col gap-3 font-medium">
            <Link to="/" className={navLinkClass("/")} onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link to="/routine" className={navLinkClass("/routine")} onClick={() => setMenuOpen(false)}>
              Routine
            </Link>

            <Link to="/contact" className={navLinkClass("/contact")} onClick={() => setMenuOpen(false)}>
              Contact
            </Link>

            <ThemeToggle />

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg border border-blue-600
                             text-blue-600 text-center"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 rounded-lg bg-blue-600
                             text-white text-center"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Hi,{" "}
                  <span className="font-semibold">
                    {user.name || user.email || "User"}
                  </span>
                </span>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500
                             text-white text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
