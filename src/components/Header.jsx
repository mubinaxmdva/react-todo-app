import React from "react";
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
function Header() {
  return (
    <nav className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          Task<span className="text-indigo-600">Flow</span>
        </h1>
        <p className="text-sm text-slate-500">Organize your daily tasks</p>
      </div>

      {/* Search */}
      <div className="hidden w-full max-w-lg items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex">
        <FaSearch className="mr-3 text-slate-400" />

        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition hover:bg-indigo-100">
          <FaBell className="text-lg text-slate-600" />

          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
          <FaUserCircle className="text-4xl text-indigo-600" />

          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-slate-800">User</h3>

            <p className="text-xs text-slate-500">their profession</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
