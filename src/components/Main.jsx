import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { FaPause, FaPlay, FaPlus, FaRedo, FaSearch } from "react-icons/fa";
import { TodoContext } from "../contexts/TodoContext";
import TodoCard from "./TodoCard";
import AlarmList from "./AlarmList";
import Timer from "./Timer";
import Stopwatch from "./Stopwatch";

const filters = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

function getDerivedStats(todos) {
  const allTasks = Array.isArray(todos) ? todos : [];
  const completedTasks = allTasks.filter((todo) => todo.completed);
  const activeTasks = allTasks.filter((todo) => !todo.completed);

  return {
    allTasks,
    activeTasks,
    completedTasks,
    totalTasks: allTasks.length,
    activeCount: activeTasks.length,
    completedCount: completedTasks.length,
    progress:
      allTasks.length === 0
        ? 0
        : Math.round((completedTasks.length / allTasks.length) * 100),
  };
}

function StatCard({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-[20px] border p-4 ${
        accent
          ? "border-[#e6ddff] bg-[#f7f3ff]"
          : "border-[#ece8f7] bg-[#faf9ff]"
      }`}>
      <p className="text-sm text-[#7d7890]">{label}</p>
      <p className="mt-2 text-[1.8rem] font-semibold tracking-[-0.05em] text-[#1d1a26]">
        {value}
      </p>
    </div>
  );
}

function DashboardPage() {
  const { state, dispatch } = useContext(TodoContext);
  const { allTasks, activeCount, completedCount, progress } = getDerivedStats(
    state.todos || [],
  );
  const [taskInput, setTaskInput] = useState("");
  const recentTasks = [...allTasks].slice(-3).reverse();

  const handleAddTask = (event) => {
    event.preventDefault();
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    dispatch({
      type: "ADD_TASK",
      payload: {
        id: Date.now(),
        title: trimmed,
        description: "",
        completed: false,
        due: "Today",
        priority: "Medium",
        category: "General",
      },
    });

    setTaskInput("");
  };

  return (
    <main className="flex-1 bg-[#fffdfd] px-4 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[860px]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-[#171827]">
              My Tasks
            </h2>
            <p className="mt-1 text-base text-[#76738a]">
              Stay organized. One step at a time.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          <StatCard label="Total Tasks" value={allTasks.length} accent />
          <StatCard label="Active" value={activeCount} />
          <StatCard label="Completed" value={completedCount} />
          <StatCard label="Completion" value={`${progress}%`} />
        </div>

        <div className="mt-6 rounded-[22px] border border-[#ece6f6] bg-[#faf8ff] p-4">
          <div className="flex items-center justify-between text-sm text-[#5f5a70]">
            <span>Progress</span>
            <span className="font-semibold text-[#5b3ec5]">{progress}%</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#eee8ff]">
            <div
              className="h-full rounded-full bg-[#6c55e8]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form
          onSubmit={handleAddTask}
          className="mt-7 flex items-center gap-3 rounded-[20px] border border-[#e8def6] bg-[#f7f2fd] p-2 shadow-sm">
          <input
            type="text"
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-transparent px-3 py-3 text-base text-[#2d2b33] placeholder:text-[#8a8497] focus:outline-none"
            aria-label="Add task"
          />
          <button
            type="submit"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6c55e8] text-white shadow-[0_10px_18px_rgba(108,85,232,0.28)]"
            aria-label="Add task button">
            <FaPlus size={16} />
          </button>
        </form>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[22px] border border-[#ece6f6] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1b1b29]">
                Recent Tasks
              </h3>
              <Link to="/tasks" className="text-sm font-medium text-[#6c55e8]">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentTasks.length === 0 ? (
                <p className="text-sm text-[#8a8497]">No tasks yet.</p>
              ) : (
                recentTasks.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between rounded-xl border border-[#ebe7f6] bg-[#faf9ff] p-3">
                    <div>
                      <p className="font-medium text-[#1f1d2c]">{todo.title}</p>
                      <p className="text-xs text-[#7f7a8d]">
                        {todo.completed ? "Completed" : "Active"}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f0ebff] px-2 py-1 text-[10px] font-semibold text-[#5b3ec5]">
                      {todo.completed ? "Done" : "Open"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[22px] border border-[#ece6f6] bg-white p-4 shadow-sm">
            <h3 className="text-base font-semibold text-[#1b1b29]">
              Today Focus
            </h3>
            <div className="mt-4 space-y-3 text-sm text-[#6c697d]">
              <div className="flex items-center justify-between rounded-xl bg-[#f7f3ff] p-3">
                <span>Focus sessions</span>
                <strong className="text-[#201d2f]">
                  {Math.max(0, completedCount)}
                </strong>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#f7f3ff] p-3">
                <span>Minutes</span>
                <strong className="text-[#201d2f]">
                  {Math.max(0, completedCount * 25)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function TaskListPage({ title, subtitle, filter, showEmptyState = true }) {
  const { state, dispatch } = useContext(TodoContext);
  const [currentFilter, setCurrentFilter] = useState(filter || "all");
  const [taskInput, setTaskInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("newest");
  const { allTasks, activeCount, completedCount } = getDerivedStats(
    state.todos || [],
  );

  const visible = useMemo(() => {
    const source =
      currentFilter === "active"
        ? allTasks.filter((todo) => !todo.completed)
        : currentFilter === "completed"
          ? allTasks.filter((todo) => todo.completed)
          : allTasks;

    const next = source.filter((todo) => {
      const term = search.toLowerCase();
      if (!term) return true;
      return [todo.title, todo.description, todo.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });

    next.sort((a, b) => {
      if (sortMode === "oldest") return Number(a.id) - Number(b.id);
      if (sortMode === "priority") {
        const order = { High: 3, Medium: 2, Low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      return Number(b.id) - Number(a.id);
    });

    return next;
  }, [allTasks, currentFilter, search, sortMode]);

  const handleAddTask = (event) => {
    event.preventDefault();
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    dispatch({
      type: "ADD_TASK",
      payload: {
        id: Date.now(),
        title: trimmed,
        description: "",
        completed: false,
        due: "Today",
        priority: "Medium",
        category: "General",
      },
    });
    setTaskInput("");
  };

  return (
    <main className="flex-1 bg-[#fffdfd] px-4 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[860px]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-[#171827]">
              {title}
            </h2>
            <p className="mt-1 text-base text-[#76738a]">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2 rounded-[14px] border border-[#ebe7f6] bg-[#faf8ff] px-3 py-2 text-sm text-[#736d86]">
            <FaSearch size={12} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks"
              className="w-40 bg-transparent text-sm text-[#1d1a26] placeholder:text-[#8a8497] outline-none"
              aria-label="Search tasks"
            />
          </div>
        </div>

        <form
          onSubmit={handleAddTask}
          className="mt-7 flex items-center gap-3 rounded-[20px] border border-[#e8def6] bg-[#f7f2fd] p-2 shadow-sm">
          <input
            type="text"
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-transparent px-3 py-3 text-base text-[#2d2b33] placeholder:text-[#8a8497] focus:outline-none"
            aria-label="Add task"
          />
          <button
            type="submit"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6c55e8] text-white"
            aria-label="Add task button">
            <FaPlus size={16} />
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map(({ key, label }) => {
            const count =
              key === "all"
                ? allTasks.length
                : key === "active"
                  ? activeCount
                  : completedCount;
            return (
              <button
                key={key}
                onClick={() => setCurrentFilter(key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  currentFilter === key
                    ? "bg-[#6c55e8] text-white"
                    : "bg-[#f2effa] text-[#5b586a] hover:bg-[#eae3fd]"
                }`}>
                {label}{" "}
                <span
                  className={`ml-2 rounded-full px-1.5 text-[10px] ${
                    currentFilter === key ? "bg-white/20" : "bg-[#e4dffb]"
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm text-[#73718a]">{visible.length} tasks</p>
          <select
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value)}
            className="rounded-xl border border-[#ece7f6] bg-[#faf8ff] px-3 py-2 text-sm text-[#2f2d42] outline-none"
            aria-label="Sort tasks">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div className="mt-6 space-y-3">
          {visible.length === 0 && showEmptyState ? (
            <div className="rounded-[22px] border border-dashed border-[#d9cdee] bg-[#faf7ff] py-14 text-center">
              <p className="text-lg font-medium text-[#7e788d]">No tasks yet</p>
              <p className="mt-2 text-sm text-[#948ea7]">
                Add your first task to get started.
              </p>
            </div>
          ) : (
            visible.map((todo) => <TodoCard key={todo.id} todo={todo} />)
          )}
        </div>
      </div>
    </main>
  );
}

function TodayPage() {
  const { state } = useContext(TodoContext);
  const tasks = state.todos || [];
  const today = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const overdue = tasks.filter(
    (todo) =>
      !todo.completed &&
      todo.due &&
      todo.due.toLowerCase().includes("yesterday"),
  );
  const todayTasks = tasks.filter(
    (todo) =>
      !todo.completed && todo.due && todo.due.toLowerCase().includes("today"),
  );
  const completedToday = tasks.filter((todo) => todo.completed);

  return (
    <main className="flex-1 bg-[#fffdfd] px-4 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[860px]">
        <div>
          <h2 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-[#171827]">
            Today
          </h2>
          <p className="mt-1 text-base text-[#76738a]">{today}</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Overdue" value={overdue.length} />
          <StatCard label="Today" value={todayTasks.length} />
          <StatCard label="Completed" value={completedToday.length} />
        </div>
        <div className="mt-8 space-y-4">
          <div className="rounded-[20px] border border-[#ece6f6] bg-[#faf8ff] p-4">
            <h3 className="text-base font-semibold text-[#1d1a26]">Overdue</h3>
            <div className="mt-3 space-y-3">
              {overdue.length === 0 ? (
                <p className="text-sm text-[#8a8497]">No overdue tasks.</p>
              ) : (
                overdue.map((task) => <TodoCard key={task.id} todo={task} />)
              )}
            </div>
          </div>
          <div className="rounded-[20px] border border-[#ece6f6] bg-[#faf8ff] p-4">
            <h3 className="text-base font-semibold text-[#1d1a26]">Today</h3>
            <div className="mt-3 space-y-3">
              {todayTasks.length === 0 ? (
                <p className="text-sm text-[#8a8497]">No tasks for today.</p>
              ) : (
                todayTasks.map((task) => <TodoCard key={task.id} todo={task} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function CalendarPage() {
  const { state, dispatch } = useContext(TodoContext);
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reminderForm, setReminderForm] = useState({
    title: "",
    message: "",
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
  });

  const monthLabel = viewDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1,
  );
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const lastDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();

  const days = [];
  for (let i = 0; i < startOffset; i += 1) days.push(null);
  for (let i = 1; i <= lastDayOfMonth; i += 1) days.push(i);

  const tasks = state.todos || [];
  const byDate = new Map();
  tasks.forEach((task) => {
    if (task.due) {
      const key = String(task.due).toLowerCase();
      if (!byDate.has(key)) byDate.set(key, 0);
      byDate.set(key, byDate.get(key) + 1);
    }
  });

  const remindersForSelectedDate = (state.reminders || []).filter(
    (reminder) => {
      if (!reminder.dateTime) return false;
      const reminderDate = new Date(reminder.dateTime);
      return (
        reminderDate.getFullYear() === selectedDate.getFullYear() &&
        reminderDate.getMonth() === selectedDate.getMonth() &&
        reminderDate.getDate() === selectedDate.getDate()
      );
    },
  );

  const changeMonth = (delta) => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1),
    );
  };

  const handleReminderSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = reminderForm.title.trim();
    const trimmedMessage = reminderForm.message.trim();
    const combinedDateTime = new Date(
      `${reminderForm.date}T${reminderForm.time || "09:00"}`,
    );

    if (!trimmedTitle || Number.isNaN(combinedDateTime.getTime())) {
      return;
    }

    dispatch({
      type: "ADD_REMINDER",
      payload: {
        id: Date.now(),
        title: trimmedTitle,
        message: trimmedMessage || "Reminder",
        dateTime: combinedDateTime.toISOString(),
        sent: false,
      },
    });

    setReminderForm({
      title: "",
      message: "",
      date: selectedDate.toISOString().slice(0, 10),
      time: "09:00",
    });
  };

  return (
    <main className="flex-1 bg-[#fffdfd] px-4 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-[#171827]">
          Calendar
        </h2>

        <div className="mt-6 rounded-[22px] border border-[#ece6f6] bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="rounded-xl border border-[#ece7f6] bg-[#faf8ff] px-3 py-2 text-sm text-[#4c4763] hover:bg-[#f1ecff]">
              Prev
            </button>
            <div className="text-center">
              <p className="text-lg font-semibold text-[#1f1d2c]">
                {monthLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="rounded-xl border border-[#ece7f6] bg-[#faf8ff] px-3 py-2 text-sm text-[#4c4763] hover:bg-[#f1ecff]">
              Next
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#7d7890]">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const isSelected =
                day &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === viewDate.getMonth() &&
                selectedDate.getFullYear() === viewDate.getFullYear();
              const isToday =
                day === today.getDate() &&
                viewDate.getMonth() === today.getMonth() &&
                viewDate.getFullYear() === today.getFullYear();
              const marker = day ? byDate.get(String(day)) || null : null;

              return (
                <button
                  key={
                    day === null
                      ? `empty-${index}`
                      : `${viewDate.getMonth()}-${day}`
                  }
                  type="button"
                  onClick={() => {
                    if (day) {
                      const nextDate = new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth(),
                        day,
                      );
                      setSelectedDate(nextDate);
                      setReminderForm((current) => ({
                        ...current,
                        date: nextDate.toISOString().slice(0, 10),
                      }));
                    }
                  }}
                  className={`flex h-16 flex-col items-center justify-center rounded-xl border text-sm transition ${
                    isSelected
                      ? "border-[#6c55e8] bg-[#f1ebff] text-[#2c2540]"
                      : "border-[#f0ebfa] bg-[#faf9ff] text-[#2d2b33]"
                  } ${isToday ? "ring-1 ring-[#6c55e8]" : ""}`}>
                  <span>{day || ""}</span>
                  {day && marker ? (
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#6c55e8]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-[22px] border border-[#ece6f6] bg-[#faf8ff] p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#1b1b29]">
              Reminders for{" "}
              {selectedDate.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
          </div>

          <form onSubmit={handleReminderSubmit} className="space-y-3">
            <input
              value={reminderForm.title}
              onChange={(event) =>
                setReminderForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Reminder title"
              className="w-full rounded-xl border border-[#e8def6] bg-white px-3 py-3 text-sm outline-none"
            />
            <textarea
              value={reminderForm.message}
              onChange={(event) =>
                setReminderForm((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
              placeholder="Message to send"
              rows="3"
              className="w-full rounded-xl border border-[#e8def6] bg-white px-3 py-3 text-sm outline-none"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="date"
                value={reminderForm.date}
                onChange={(event) =>
                  setReminderForm((current) => ({
                    ...current,
                    date: event.target.value,
                  }))
                }
                className="rounded-xl border border-[#e8def6] bg-white px-3 py-3 text-sm outline-none"
              />
              <input
                type="time"
                value={reminderForm.time}
                onChange={(event) =>
                  setReminderForm((current) => ({
                    ...current,
                    time: event.target.value,
                  }))
                }
                className="rounded-xl border border-[#e8def6] bg-white px-3 py-3 text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#6c55e8] px-4 py-2 text-sm font-medium text-white">
              Add reminder
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {remindersForSelectedDate.length === 0 ? (
              <p className="text-sm text-[#7d7890]">
                No reminders for this day.
              </p>
            ) : (
              remindersForSelectedDate.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e9e1fb] bg-white p-3">
                  <div>
                    <p className="font-medium text-[#1d1a26]">
                      {reminder.title}
                    </p>
                    <p className="text-xs text-[#7d7890]">
                      {new Date(reminder.dateTime).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-1 text-xs text-[#6f6983]">
                      {reminder.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "DELETE_REMINDER",
                        payload: reminder.id,
                      })
                    }
                    className="rounded-lg border border-[#e8def6] px-2 py-1 text-xs text-[#5f5a70]">
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function FocusPage() {
  const { state, dispatch } = useContext(TodoContext);
  const { completedCount } = getDerivedStats(state.todos || []);
  const { settings, focusSession } = state;
  const durations = {
    focus: Number(settings.focus || 25) * 60,
    shortBreak: Number(settings.shortBreak || 5) * 60,
    longBreak: Number(settings.longBreak || 15) * 60,
  };

  // Local UI state for focus settings editing
  const [editingSettings, setEditingSettings] = React.useState(false);
  const [localSettings, setLocalSettings] = React.useState({
    focus: settings.focus || 25,
    shortBreak: settings.shortBreak || 5,
    longBreak: settings.longBreak || 15,
    longBreakInterval: settings.longBreakInterval || 4,
  });

  const timeLeft = focusSession?.timeLeft ?? durations.focus;
  const mode = focusSession?.mode || "focus";
  const isRunning = Boolean(focusSession?.isRunning);
  const isAlarmPlaying = Boolean(focusSession?.isAlarmPlaying);
  const selectedTaskId =
    focusSession?.selectedTaskId || (state.todos || [])[0]?.id || "";

  useEffect(() => {
    if (!focusSession?.selectedTaskId && (state.todos || [])[0]?.id) {
      dispatch({
        type: "SET_SELECTED_TASK",
        payload: (state.todos || [])[0].id,
      });
    }
  }, [focusSession?.selectedTaskId, state.todos, dispatch]);

  const formatted = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
    timeLeft % 60,
  ).padStart(2, "0")}`;

  const progressPercent = (() => {
    const total = durations[mode] || durations.focus;
    const left = timeLeft || 0;
    return Math.round(((total - left) / total) * 100);
  })();

  const switchMode = (nextMode) => {
    dispatch({ type: "SET_FOCUS_MODE", payload: { mode: nextMode } });
  };

  const tasks = state.todos || [];

  return (
    <main className="flex-1 bg-[#fffdfd] px-4 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-[#171827]">
          Focus
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[24px] border border-[#ece6f6] bg-[#faf8ff] p-6 text-center shadow-sm">
            
            <div className="mt-3">
              <div
                className="mx-auto relative flex items-center justify-center"
                style={{ width: 224, height: 224 }}>
                {/* Circular progress ring */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full"
                  style={{ transform: "rotate(-90deg)" }}>
                  <defs />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#efeafd"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#6c55e8"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={Math.PI * 2 * 45}
                    strokeDashoffset={
                      Math.PI *
                      2 *
                      45 *
                      (1 -
                        (timeLeft / (durations[mode] || durations.focus) || 0))
                    }
                    style={{ transition: "stroke-dashoffset 0.6s linear" }}
                  />
                </svg>

                {/* timer itself (keeps existing visual) */}
                <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full border-[12px] border-[#eae1ff] bg-white text-5xl font-semibold tracking-[-0.06em] text-[#1d1a26]">
                  {formatted}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              {Object.keys(durations).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchMode(key)}
                  className={`rounded-full px-3 py-2 text-sm ${
                    mode === key
                      ? "bg-[#6c55e8] text-white"
                      : "bg-[#f1ecff] text-[#53486d]"
                  }`}>
                  {key === "focus"
                    ? "Focus"
                    : key === "shortBreak"
                      ? "Short Break"
                      : "Long Break"}
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: "START_FOCUS_SESSION" })}
                className="rounded-xl bg-[#6c55e8] px-4 py-2 text-sm font-medium text-white">
                <FaPlay size={12} className="mr-2 inline" />
                Start
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "PAUSE_FOCUS_SESSION" })}
                className="rounded-xl bg-[#f1ecff] px-4 py-2 text-sm font-medium text-[#4f4a5d]">
                <FaPause size={12} className="mr-2 inline" />
                Pause
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "RESET_FOCUS_SESSION" })}
                className="rounded-xl bg-[#f6f0ff] px-4 py-2 text-sm font-medium text-[#4f4a5d]">
                <FaRedo size={12} className="mr-2 inline" />
                Reset
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setEditingSettings((s) => !s)}
                className="mt-2 rounded-md bg-[#f6f1ff] px-3 py-2 text-sm">
                {editingSettings ? "Close settings" : "Focus settings"}
              </button>

              {editingSettings && (
                <div className="mt-3 space-y-3 text-left">
                  <label className="block">
                    Focus (minutes)
                    <input
                      type="number"
                      className="w-full mt-1"
                      value={localSettings.focus}
                      onChange={(e) =>
                        setLocalSettings((s) => ({
                          ...s,
                          focus: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                  <label className="block">
                    Short break (minutes)
                    <input
                      type="number"
                      className="w-full mt-1"
                      value={localSettings.shortBreak}
                      onChange={(e) =>
                        setLocalSettings((s) => ({
                          ...s,
                          shortBreak: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                  <label className="block">
                    Long break (minutes)
                    <input
                      type="number"
                      className="w-full mt-1"
                      value={localSettings.longBreak}
                      onChange={(e) =>
                        setLocalSettings((s) => ({
                          ...s,
                          longBreak: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                  <label className="block">
                    Long break interval
                    <input
                      type="number"
                      className="w-full mt-1"
                      value={localSettings.longBreakInterval}
                      onChange={(e) =>
                        setLocalSettings((s) => ({
                          ...s,
                          longBreakInterval: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        dispatch({
                          type: "SET_SETTINGS",
                          payload: localSettings,
                        });
                        setEditingSettings(false);
                      }}
                      className="px-3 py-2 rounded bg-[#6c55e8] text-white">
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setLocalSettings({
                          focus: settings.focus,
                          shortBreak: settings.shortBreak,
                          longBreak: settings.longBreak,
                          longBreakInterval: settings.longBreakInterval || 4,
                        });
                        setEditingSettings(false);
                      }}
                      className="px-3 py-2 rounded bg-[#f6f0ff]">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isAlarmPlaying && (
              <button
                type="button"
                onClick={() => dispatch({ type: "STOP_ALARM" })}
                className="mt-4 rounded-xl bg-[#d92b4d] px-4 py-2 text-sm font-medium text-white shadow-sm">
                Stop alarm
              </button>
            )}
          </div>

          <div className="rounded-[24px] border border-[#ece6f6] bg-white p-4 shadow-sm">
            <h3 className="text-base font-semibold text-[#1b1b29]">
              Focus on task
            </h3>
            <select
              value={selectedTaskId}
              onChange={(event) =>
                dispatch({
                  type: "SET_SELECTED_TASK",
                  payload: event.target.value,
                })
              }
              className="mt-3 w-full rounded-xl border border-[#ece7f6] bg-[#faf8ff] px-3 py-3 text-sm outline-none"
              aria-label="Select task for focus">
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
            <div className="mt-4 rounded-xl bg-[#f6f1ff] p-3 text-sm text-[#5c596b]">
              <div className="flex items-center justify-between">
                <span>Sessions today</span>
                <strong className="text-[#231d39]">
                  {Math.max(0, completedCount)}
                </strong>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Minutes today</span>
                <strong className="text-[#231d39]">
                  {Math.max(0, completedCount * 25)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatisticsPage() {
  const { state } = useContext(TodoContext);
  const { allTasks, completedCount, activeCount, progress } = getDerivedStats(
    state.todos || [],
  );

  // compute weekly stats from tasks and focusHistory
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // monday
  startOfWeek.setHours(0, 0, 0, 0);

  const tasksThisWeek = (state.todos || []).filter(
    (t) => t.completedAt && new Date(t.completedAt) >= startOfWeek,
  );
  const sessions = Array.isArray(state.focusHistory) ? state.focusHistory : [];
  const sessionsThisWeek = sessions.filter(
    (s) => new Date(s.finishedAt) >= startOfWeek,
  );

  // simple bar data for last 7 days
  const bars = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const dayKey = day.toISOString().slice(0, 10);
    const tasksCount = (state.todos || []).filter(
      (t) => t.completedAt && t.completedAt.startsWith(dayKey),
    ).length;
    const sessionsCount = sessions.filter((s) =>
      s.finishedAt.startsWith(dayKey),
    ).length;
    return { day, tasksCount, sessionsCount };
  });

  return (
    <main className="flex-1 bg-[#fffdfd] px-4 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-[#171827]">
          Statistics
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <StatCard label="Total" value={allTasks.length} accent />
          <StatCard label="Completed" value={completedCount} />
          <StatCard label="Active" value={activeCount} />
          <StatCard label="Rate" value={`${progress}%`} />
        </div>

        <div className="mt-4">
          <h3 className="text-md font-medium">This Week</h3>
          <div className="mt-3 flex gap-3">
            {bars.map((b, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div
                  className="mx-auto h-24 w-8 rounded bg-[#f1ecff]"
                  style={{
                    height: `${Math.min(100, (b.tasksCount + b.sessionsCount) * 12)}%`,
                  }}
                />
                <div className="mt-2 text-xs text-[#6b657a]">
                  {b.day.toLocaleDateString(undefined, { weekday: "short" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="flex-1 bg-[#fffdfd] px-4 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[860px] rounded-[22px] border border-[#ece6f6] bg-[#faf8ff] p-6 shadow-sm">
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-[#171827]">
          About
        </h2>
        <p className="mt-4 text-base leading-7 text-[#5f5c70]">
          Todo app is a lightweight productivity dashboard for organizing tasks,
          planning the day, and protecting focus time. The app keeps a single
          source of truth for task data while making it easy to track progress,
          complete work, and stay consistent.
        </p>
      </div>
    </main>
  );
}

function SettingsPage() {
  const { state, dispatch } = useContext(TodoContext);

  const updateSetting = (key, value) => {
    if (key === "alarmClockEnabled") {
      dispatch({
        type: "SET_SETTINGS",
        payload: { [key]: Boolean(value) },
      });
      return;
    }

    if (key === "alarmClockTime") {
      dispatch({
        type: "SET_SETTINGS",
        payload: { [key]: String(value) },
      });
      return;
    }

    const nextValue = Number(value);
    if (!Number.isFinite(nextValue) || nextValue <= 0) return;

    dispatch({
      type: "SET_SETTINGS",
      payload: { [key]: nextValue },
    });
  };

  return (
    <main className="flex-1 bg-[#fffdfd] px-4 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[860px] rounded-[22px] border border-[#ece6f6] bg-[#faf8ff] p-6 shadow-sm">
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-[#171827]">
          Settings
        </h2>
        <div className="mt-5 space-y-4 text-sm text-[#4e4a5d]">
          <label className="flex items-center justify-between gap-4 rounded-xl border border-[#ece7f6] bg-white p-3">
            <span>Focus duration</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={state.settings?.focus ?? 25}
                onChange={(event) => updateSetting("focus", event.target.value)}
                className="w-20 rounded-lg border border-[#e4dff7] bg-[#f7f4ff] px-2 py-1 text-right text-[#2f2d42] outline-none"
              />
              <span>min</span>
            </div>
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-[#ece7f6] bg-white p-3">
            <span>Short break</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={state.settings?.shortBreak ?? 5}
                onChange={(event) =>
                  updateSetting("shortBreak", event.target.value)
                }
                className="w-20 rounded-lg border border-[#e4dff7] bg-[#f7f4ff] px-2 py-1 text-right text-[#2f2d42] outline-none"
              />
              <span>min</span>
            </div>
          </label>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-[#ece7f6] bg-white p-3">
            <span>Long break</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={state.settings?.longBreak ?? 15}
                onChange={(event) =>
                  updateSetting("longBreak", event.target.value)
                }
                className="w-20 rounded-lg border border-[#e4dff7] bg-[#f7f4ff] px-2 py-1 text-right text-[#2f2d42] outline-none"
              />
              <span>min</span>
            </div>
          </label>

          <div className="rounded-xl border border-[#ece7f6] bg-white p-3">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-[#2a2835]">Alarm voice</span>
              <select
                value={state.settings?.alarmVoice ?? "classic"}
                onChange={(event) =>
                  dispatch({
                    type: "SET_ALARM_VOICE",
                    payload: event.target.value,
                  })
                }
                className="rounded-lg border border-[#e4dff7] bg-[#f7f4ff] px-2 py-2 text-[#2f2d42] outline-none">
                <option value="classic">Classic chime</option>
                <option value="soft">Soft melody</option>
                <option value="sharp">Sharp alert</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-[#ece7f6] bg-white p-3">
            <div className="flex items-center justify-between gap-4">
              <span className="font-medium text-[#2a2835]">Wake-up alarm</span>
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[#5b566e]">
                <input
                  type="checkbox"
                  checked={Boolean(state.settings?.alarmClockEnabled)}
                  onChange={(event) =>
                    updateSetting("alarmClockEnabled", event.target.checked)
                  }
                />
                Enabled
              </label>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span>Alarm time</span>
              <input
                type="time"
                value={state.settings?.alarmClockTime ?? "07:00"}
                onChange={(event) =>
                  updateSetting("alarmClockTime", event.target.value)
                }
                className="rounded-lg border border-[#e4dff7] bg-[#f7f4ff] px-2 py-2 text-[#2f2d42] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Main() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/all" element={<Navigate to="/tasks" replace />} />
      <Route
        path="/tasks"
        element={
          <TaskListPage
            title="All Tasks"
            subtitle="Everything in one place."
            filter="all"
          />
        }
      />
      <Route path="/today" element={<TodayPage />} />
      {/* Active and Completed routes removed — use in-page filters inside /tasks */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/focus" element={<FocusPage />} />
      <Route path="/alarms" element={<AlarmList />} />
      <Route path="/timer" element={<Timer />} />
      <Route path="/stopwatch" element={<Stopwatch />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default Main;
