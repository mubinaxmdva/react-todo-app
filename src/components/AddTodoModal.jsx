import { useContext, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { TodoContext } from "../contexts/TodoContext";

const initialForm = {
  title: "",
  description: "",
  priority: "High",
  category: "Study",
};

const AddTodoModal = ({ close }) => {
  const { dispatch } = useContext(TodoContext);
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    if (!title) return;

    const newTask = {
      id: Date.now(),
      title,
      description: formData.description.trim(),
      priority: formData.priority,
      category: formData.category,
      completed: false,
    };

    dispatch({ type: "ADD_TASK", payload: newTask });
    setFormData(initialForm);
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6 lg:p-8"
      >
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
            type="button"
            onClick={close}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-red-100 hover:text-red-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="max-h-[50vh] space-y-5 overflow-y-auto pr-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Task Name
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write something..."
              className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
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
                name="category"
                value={formData.category}
                onChange={handleChange}
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

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={close}
            className="w-full rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
          >
            <FaPlus />
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTodoModal;
