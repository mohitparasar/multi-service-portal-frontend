import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { getDashboardForRole } from "../../utils/roles";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { isAuthenticated, role, logout } = useAuth();

  const links = [
    ["/", "Home"],
    ["/services", "Services"],
    ["/providers", "Providers"],
    ["/contact", "Contact"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/90 backdrop-blur-xl shadow-sm">
      <nav className="mx-auto flex h-20 w-[min(1200px,92%)] items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition hover:scale-105"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-msp-accent text-lg font-bold text-white shadow-lg">
            M
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-msp-primary">
              MSP
            </h1>

            <p className="-mt-1 text-xs font-medium tracking-wider text-msp-secondary">
              Multi Service Portal
            </p>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Navigation */}
        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 top-20 w-full flex-col gap-5 border-b bg-white px-6 py-6 shadow-lg md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {links.map(([to, label]) => (
            <NavLink
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative font-semibold transition duration-200 ${
                  isActive
                    ? "text-msp-accent"
                    : "text-msp-secondary hover:text-msp-accent"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="flex flex-col gap-3 md:ml-4 md:flex-row">
              <Link
                to={getDashboardForRole(role)}
                className="rounded-xl border border-msp-accent px-5 py-2.5 text-center font-semibold text-msp-accent transition hover:bg-msp-accent hover:text-white"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="rounded-xl bg-msp-primary px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:ml-4 md:flex-row">
              <Link
                to="/login"
                className="rounded-xl px-5 py-2.5 text-center font-semibold text-msp-primary transition hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-msp-accent px-5 py-2.5 text-center font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}