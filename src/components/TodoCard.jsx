import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaCheck,
  FaEllipsisV,
  FaRegCircle,
  FaTrash,
  FaPencilAlt,
} from "react-icons/fa";
import { TodoContext } from "../contexts/TodoContext";

const TodoCard = ({ todo }) => {
  const { dispatch } = useContext(TodoContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setDraftTitle(todo.title);
  }, [todo.title]);

  const toggleTodo = (event) => {
    event.stopPropagation();
    dispatch({
      type: "EDIT_TASK",
      payload: { ...todo, completed: !todo.completed },
    });
  };

  const deleteTodo = (event) => {
    event.stopPropagation();
    setIsMenuOpen(false);
    dispatch({ type: "DELETE_TASK", payload: todo.id });
  };

  const openEdit = (event) => {
    event.stopPropagation();
    setIsEditing(true);
    setDraftTitle(todo.title);
    setIsMenuOpen(false);
  };

  const saveEdit = (event) => {
    event.stopPropagation();
    const trimmed = draftTitle.trim();

    if (!trimmed) {
      setDraftTitle(todo.title);
      setIsEditing(false);
      return;
    }

    dispatch({
      type: "EDIT_TASK",
      payload: { ...todo, title: trimmed },
    });
    setIsEditing(false);
  };

  const cancelEdit = (event) => {
    event.stopPropagation();
    setDraftTitle(todo.title);
    setIsEditing(false);
  };

  const menuToggle = (event) => {
    event.stopPropagation();
    setIsMenuOpen((current) => !current);
  };

  const subtitle = todo.due || todo.description || "No date";

  return (
    <div
      className={`relative flex items-center gap-3 rounded-[18px] border p-3 transition ${
        todo.completed
          ? "border-[#e8def7] bg-[#f4f0fa]"
          : "border-[#eae3f5] bg-[#faf8ff]"
      }`}>
      <button
        type="button"
        onClick={toggleTodo}
        className={`flex h-6 w-6 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-[#cfc2fe] ${
          todo.completed
            ? "border-[#7b5ae9] bg-[#7b5ae9] text-white"
            : "border-[#c9bbef] bg-white text-transparent"
        }`}
        aria-label={
          todo.completed ? "Mark task as active" : "Mark task as completed"
        }>
        {todo.completed ? <FaCheck size={10} /> : <FaRegCircle size={10} />}
      </button>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              className="w-full rounded-xl border border-[#ddd0f5] bg-white px-3 py-2 text-[1rem] text-[#2d2b33] outline-none focus:border-[#8a6ef0]"
              aria-label="Edit task title"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-lg bg-[#7b5ae9] px-3 py-2 text-xs font-medium text-white">
                Save
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-[#e1d8f5] bg-white px-3 py-2 text-xs text-[#5d5969]">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p
              className={`text-[1.05rem] font-medium ${
                todo.completed
                  ? "text-[#b4aeca] line-through"
                  : "text-[#2b2932]"
              }`}>
              {todo.title}
            </p>

            {subtitle && (
              <p
                className={`mt-1 text-xs ${
                  todo.completed ? "text-[#b5adc8]" : "text-[#7f7a8d]"
                }`}>
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={menuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7f7a8d] transition hover:bg-[#efe7ff] hover:text-[#5b43c4] focus:outline-none focus:ring-2 focus:ring-[#cfc2fe]"
          aria-label="Open task actions">
          <FaEllipsisV size={14} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 z-20 mt-2 w-40 rounded-2xl border border-[#e8def7] bg-white p-2 shadow-[0_18px_40px_rgba(113,99,160,0.18)]">
            <button
              type="button"
              onClick={openEdit}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#2d2b33] transition hover:bg-[#f2ecff]">
              <FaPencilAlt size={12} />
              Edit
            </button>
            <button
              type="button"
              onClick={deleteTodo}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#d63c5a] transition hover:bg-[#fdf0f3]">
              <FaTrash size={12} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoCard;
