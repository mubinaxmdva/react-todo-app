import React, { createContext, useReducer } from "react";
import reducer, { initialState } from "../reducer/TodoReducer";

export const TodoContext = createContext(null);

function TodoContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

export default TodoContextProvider;
