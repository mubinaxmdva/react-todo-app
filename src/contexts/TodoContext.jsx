import React, { createContext, useEffect, useReducer } from "react";
import { reducer, initialState } from "../reducer/TodoReducer";

export const TodoContext = createContext();
const STORAGE_KEY = "nova-productivity-state";

function readSavedState() {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return initialState;
    }

    const parsed = JSON.parse(saved);
    return {
      todos: Array.isArray(parsed.todos) ? parsed.todos : initialState.todos,
      settings: {
        ...initialState.settings,
        ...(parsed.settings || {}),
      },
      focusSession: {
        ...initialState.focusSession,
        ...(parsed.focusSession || {}),
      },
      reminders: Array.isArray(parsed.reminders) ? parsed.reminders : [],
      alarms: Array.isArray(parsed.alarms)
        ? parsed.alarms
        : initialState.alarms,
    };
  } catch {
    return initialState;
  }
}

function TodoContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, readSavedState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors in restricted environments
    }
  }, [state]);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export default TodoContextProvider;
