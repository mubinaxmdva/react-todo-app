import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaCog,
  FaInfoCircle,
  FaInbox,
  FaListUl,
  FaRegCheckCircle,
  FaRegCircle,
  FaTachometerAlt,
} from "react-icons/fa";
import { TodoContext } from "../contexts/TodoContext";

function Header() {
  const { state } = useContext(TodoContext);
  const tasks = Array.isArray(state.todos) ? state.todos : [];
  const completed = tasks.filter((todo) => todo.completed).length;
  const total = tasks.length;
  const active = total - completed;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  const primaryLinks = [
    { to: "/", label: "Dashboard", count: total, icon: FaTachometerAlt },
    { to: "/tasks", label: "All Tasks", count: total, icon: FaListUl },
    { to: "/today", label: "Today", count: 0, icon: FaClock },
    { to: "/calendar", label: "Calendar", count: 0, icon: FaCalendarAlt },
    { to: "/focus", label: "Focus", count: 0, icon: FaClock },
    { to: "/statistics", label: "Statistics", count: 0, icon: FaCheck },
  ];

  const secondaryLinks = [
    { to: "/about", label: "About", icon: FaInfoCircle },
    { to: "/settings", label: "Settings", icon: FaCog },
    { to: "/clock", label: "Clock", icon: FaClock },
  ];

  return (
    <aside className="w-full max-w-[290px] shrink-0 border-r border-[#ece2f8] bg-[#fbfbfe] p-5 md:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6c55e8] text-white shadow-[0_10px_20px_rgba(108,85,232,0.25)]">
          <FaInbox size={16} />
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8f8da4]">
            Productivity
          </p>
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[#171827]">
            Nova
          </h1>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {primaryLinks.map(({ to, label, count, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition ${
                isActive
                  ? "bg-[#efe9ff] text-[#4d3bc0] shadow-sm"
                  : "text-[#4f4b5d] hover:bg-[#f3f0ff]"
              }`
            }>
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3 font-medium">
                  <Icon
                    size={15}
                    className={isActive ? "text-[#6c55e8]" : "text-[#66637a]"}
                  />
                  {label}
                </span>
                {count > 0 && (
                  <span
                    className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold ${
                      isActive
                        ? "bg-[#d9cffd] text-[#4e3dba]"
                        : "bg-[#f0ebff] text-[#5f5b74]"
                    }`}>
                    {count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10 rounded-[22px] border border-[#eae6f8] bg-[#f8f5ff] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c87a1]">
          Progress
        </p>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#ece5ff]">
          <div
            className="h-full rounded-full bg-[#6c55e8]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[12px] text-[#605d72]">
          <span>
            {completed} / {total} done
          </span>
          <span className="font-semibold text-[#4d3bc0]">{progress}%</span>
        </div>
      </div>

      <div className="mt-8 space-y-2 border-t border-[#ece7f7] pt-5">
        {secondaryLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-2xl px-3 py-3 transition ${
                isActive
                  ? "bg-[#efe9ff] text-[#4d3bc0]"
                  : "text-[#4f4b5d] hover:bg-[#f3f0ff]"
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon
                  size={15}
                  className={isActive ? "text-[#6c55e8]" : "text-[#66637a]"}
                />
                <span className="font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Header;
