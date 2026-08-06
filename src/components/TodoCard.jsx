import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";

const TodoItem = ({ todo }) => {
  if (!todo) return null;

  return (
    <div className="group flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <button className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600 transition hover:bg-green-500 hover:text-white">
          <FaCheckCircle />
        </button>

        <div>
          <h3 className="text-lg font-semibold text-slate-800">{todo.title}</h3>

          <p className="mt-1 text-sm text-slate-500">{todo.description}</p>

          <div className="mt-3 flex items-center gap-3">
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
              {todo.priority}
            </span>

            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600">
              {todo.category}
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition hover:bg-amber-500 hover:text-white">
          <FaEdit />
        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-500 hover:text-white">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
