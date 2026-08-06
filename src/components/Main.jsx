import React, { useState, useContext } from "react";
import { FaPlus } from "react-icons/fa";
import AddTodoModal from "./AddTodoModal";
import { TodoContext } from "../contexts/TodoContext";
import TodoCard from "./TodoCard";

function Main() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state } = useContext(TodoContext);
  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 active:scale-95"
      >
        <FaPlus size={16} />
      </button>
      {isModalOpen && <AddTodoModal close={() => setIsModalOpen(false)} />}

      <div>
        <div className="space-y-4">
          {/* Consume todos from context */}
          {state && state.todos && state.todos.length > 0 ? (
            state.todos.map((t) => <TodoCard key={t.id} todo={t} />)
          ) : (
            <div className="flex flex-col items-center mt-15 justify-center rounded-3xl border-2 border-dashed border-slate-300 py-20">
              <h2 className="text-2xl font-semibold text-slate-500">
                No tasks yet
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Start by adding your first task.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
