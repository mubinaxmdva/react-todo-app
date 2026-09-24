import { todos } from "../data/data";

const getDurationMap = (settings = {}) => ({
  focus: Number(settings.focus || 25) * 60,
  shortBreak: Number(settings.shortBreak || 5) * 60,
  longBreak: Number(settings.longBreak || 15) * 60,
});

export const initialState = {
  todos: Array.isArray(todos) ? todos : [],
  settings: {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    allowAlarmSound: false,
    alarmVoice: "classic",
    alarmClockEnabled: false,
    alarmClockTime: "07:00",
  },
  focusSession: {
    mode: "focus",
    timeLeft: 25 * 60,
    isRunning: false,
    selectedTaskId: "",
    isAlarmPlaying: false,
    endsAt: null,
    completedSessions: 0,
  },
  reminders: [],
  alarms: [],
  focusHistory: [],
};

export function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        todos: [
          { ...action.payload, createdAt: new Date().toISOString() },
          ...(state.todos || []),
        ],
      };

    case "DELETE_TASK":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case "EDIT_TASK": {
      const payload = action.payload || {};
      return {
        ...state,
        todos: (state.todos || []).map((todo) => {
          if (todo.id !== payload.id) return todo;
          const wasCompleted = Boolean(todo.completed);
          const willCompleted = Boolean(payload.completed);
          if (!wasCompleted && willCompleted) {
            return {
              ...todo,
              ...payload,
              completedAt: new Date().toISOString(),
            };
          }
          if (wasCompleted && !willCompleted) {
            const { completedAt, ...rest } = { ...todo, ...payload };
            return { ...rest, completedAt: null };
          }
          return { ...todo, ...payload };
        }),
      };
    }

    case "SET_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case "SET_ALARM_VOICE":
      return {
        ...state,
        settings: {
          ...state.settings,
          alarmVoice: action.payload,
        },
      };

    /* Alarms CRUD */
    case "ADD_ALARM":
      return { ...state, alarms: [...(state.alarms || []), action.payload] };

    case "EDIT_ALARM":
      return {
        ...state,
        alarms: (state.alarms || []).map((a) =>
          a.id === action.payload.id ? action.payload : a,
        ),
      };

    case "DELETE_ALARM":
      return {
        ...state,
        alarms: (state.alarms || []).filter((a) => a.id !== action.payload),
      };

    case "TOGGLE_ALARM":
      return {
        ...state,
        alarms: (state.alarms || []).map((a) =>
          a.id === action.payload ? { ...a, enabled: !a.enabled } : a,
        ),
      };

    case "SET_ACTIVE_ALARM":
      return {
        ...state,
        focusSession: { ...state.focusSession, activeAlarmId: action.payload },
      };

    case "SNOOZE_ALARM": {
      // payload: { alarmId, untilISO }
      const { alarmId, until } = action.payload || {};
      return {
        ...state,
        alarms: (state.alarms || []).map((a) =>
          a.id === alarmId ? { ...a, snoozedUntil: until } : a,
        ),
      };
    }

    case "SET_SELECTED_TASK":
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          selectedTaskId: action.payload,
        },
      };

    case "SET_FOCUS_MODE": {
      const durationMap = getDurationMap(state.settings);
      const mode = action.payload?.mode || "focus";
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          mode,
          timeLeft: durationMap[mode] || durationMap.focus,
          isRunning: false,
          isAlarmPlaying: false,
          endsAt: null,
        },
      };
    }

    case "START_FOCUS_SESSION": {
      const durationMap = getDurationMap(state.settings);
      const mode = state.focusSession?.mode || "focus";
      const timeLeft = state.focusSession?.timeLeft ?? durationMap[mode];
      const endsAt = Date.now() + (timeLeft || durationMap[mode]) * 1000;
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          isRunning: true,
          isAlarmPlaying: false,
          endsAt,
        },
      };
    }

    case "PAUSE_FOCUS_SESSION": {
      const now = Date.now();
      const endsAt = state.focusSession?.endsAt;
      let timeLeft = state.focusSession?.timeLeft ?? 0;
      if (endsAt && state.focusSession?.isRunning) {
        timeLeft = Math.max(0, Math.round((endsAt - now) / 1000));
      }
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          isRunning: false,
          timeLeft,
          endsAt: null,
        },
      };
    }

    case "STOP_ALARM":
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          isRunning: false,
          isAlarmPlaying: false,
          activeAlarmId: null,
        },
      };

    case "TRIGGER_ALARM":
      // payload: { alarmId }
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          isRunning: false,
          isAlarmPlaying: true,
          activeAlarmId:
            action.payload?.alarmId ??
            state.focusSession?.activeAlarmId ??
            null,
        },
      };

    case "RESET_FOCUS_SESSION": {
      const mode = state.focusSession?.mode || "focus";
      const durationMap = getDurationMap(state.settings);
      return {
        ...state,
        focusSession: {
          ...state.focusSession,
          timeLeft: durationMap[mode] || durationMap.focus,
          isRunning: false,
          isAlarmPlaying: false,
          endsAt: null,
        },
      };
    }

    case "TICK_FOCUS_SESSION": {
      if (!state.focusSession?.isRunning) return state;
      const now = Date.now();
      const endsAt = state.focusSession?.endsAt;
      const durationMap = getDurationMap(state.settings);
      const mode = state.focusSession?.mode || "focus";
      let timeLeft = state.focusSession?.timeLeft ?? durationMap[mode];
      if (endsAt) {
        timeLeft = Math.max(0, Math.round((endsAt - now) / 1000));
      } else {
        timeLeft = Math.max(0, (timeLeft || 0) - 1);
      }

      const finished = timeLeft === 0;

      if (!finished) {
        return {
          ...state,
          focusSession: {
            ...state.focusSession,
            timeLeft,
          },
        };
      }

      // Session finished — determine next mode and record history
      const nextState = { ...state };
      const longInterval = Number(state.settings?.longBreakInterval || 4);
      let completed = state.focusSession?.completedSessions || 0;
      const historyEntry = {
        mode,
        finishedAt: new Date().toISOString(),
        duration: durationMap[mode] || durationMap.focus,
      };
      nextState.focusHistory = [...(state.focusHistory || []), historyEntry];

      if (mode === "focus") {
        completed += 1;
        const isLong = longInterval > 0 && completed % longInterval === 0;
        const nextMode = isLong ? "longBreak" : "shortBreak";
        nextState.focusSession = {
          ...state.focusSession,
          isRunning: false,
          isAlarmPlaying: true,
          mode: nextMode,
          timeLeft: durationMap[nextMode] || durationMap.shortBreak,
          endsAt: null,
          completedSessions: completed,
        };
      } else {
        // finished a break -> go back to focus
        nextState.focusSession = {
          ...state.focusSession,
          isRunning: false,
          isAlarmPlaying: true,
          mode: "focus",
          timeLeft: durationMap.focus,
          endsAt: null,
        };
      }

      return nextState;
    }

    case "ADD_REMINDER":
      return {
        ...state,
        reminders: [action.payload, ...(state.reminders || [])],
      };

    case "DELETE_REMINDER":
      return {
        ...state,
        reminders: (state.reminders || []).filter(
          (reminder) => reminder.id !== action.payload,
        ),
      };

    case "MARK_REMINDER_SENT":
      return {
        ...state,
        reminders: (state.reminders || []).map((reminder) =>
          reminder.id === action.payload
            ? { ...reminder, sent: true, sentAt: new Date().toISOString() }
            : reminder,
        ),
      };

    default:
      return state;
  }
}
