import { todos } from "../data/data";

export const initialState = {
  todos: Array.isArray(todos) ? todos : [],
};

export function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, todos: [action.payload, ...(state.todos || [])] };

    case "DELETE_TASK":
      return {
        ...state,
        todos: (state.todos || []).filter((t) => t.id !== action.payload),
      };

    case "EDIT_TASK":
      return {
        ...state,
        todos: (state.todos || []).map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };

    default:
      return state;
  }
}

export default reducer;
