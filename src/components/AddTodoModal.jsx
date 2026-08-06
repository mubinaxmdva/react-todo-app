import { FaPlus, FaTimes } from "react-icons/fa";
import React, { useState, useContext } from "react";
import { TodoContext } from "../contexts/TodoContext";

const AddTodoModal = ({ close }) => {
  const { dispatch } = useContext(TodoContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");
  const [category, setCategory] = useState("Study");

  const handleAdd = () => {
    if (!title.trim()) return alert("Please enter a task name");

    const task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
    };

    dispatch({ type: "ADD_TASK", payload: task });
    // reset and close
    setTitle("");
    setDescription("");
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className=" w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Add New Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new task to stay organized.
            </p>
          </div>

          <button
            onClick={close}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-red-100 hover:text-red-600"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <div className="max-h-[50vh] overflow-y-auto pr-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Task Name
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Enter task..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Write something..."
              className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
            />
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option>Study</option>
                <option>Work</option>
                <option>Personal</option>
                <option>Shopping</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={close}
            className="w-full rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
          >
            <FaPlus />
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTodoModal;
