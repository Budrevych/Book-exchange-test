import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/useAuthStore";
import { logout as authLogout } from "../../api/auth";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authLogout();
      clearUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  const activeClass = ({ isActive }) =>
    isActive ? "text-sky-600 font-semibold" : "text-gray-700";

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <NavLink to="/" className={activeClass}>
            Home
          </NavLink>
          <NavLink to="/books" className={activeClass}>
            Books
          </NavLink>
          {user && (
            <NavLink to="/me/books" className={activeClass}>
              My Books
            </NavLink>
          )}
          {user?.role === "Admin" && (
            <NavLink to="/admin" className={activeClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm text-gray-600">
                {user.name ? user.name : user.email}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-gray-700 hover:text-sky-500">
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-3 py-1 rounded bg-sky-400 text-white hover:bg-sky-600"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
