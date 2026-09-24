import React, { useContext } from "react";
import { TodoContext } from "../contexts/TodoContext";

export default function ActiveAlarmOverlay() {
  const { state, dispatch } = useContext(TodoContext);
  const activeId = state.focusSession?.activeAlarmId;
  const alarm = (Array.isArray(state.alarms) ? state.alarms : []).find(
    (a) => a.id === activeId,
  );

  if (!state.focusSession?.isAlarmPlaying || !alarm) return null;

  const handleSnooze = () => {
    const minutes = alarm.snooze || 5;
    const until = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    dispatch({ type: "SNOOZE_ALARM", payload: { alarmId: alarm.id, until } });
    dispatch({ type: "STOP_ALARM" });
  };

  const handleDismiss = () => {
    dispatch({ type: "STOP_ALARM" });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h3 className="text-lg font-semibold">Alarm</h3>
        <p className="mt-2 text-sm text-[#6b657a]">{alarm.label || "Alarm"}</p>
        <p className="mt-1 text-sm text-[#6b657a]">{alarm.time}</p>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={handleSnooze}
            className="rounded-xl bg-[#f1ecff] px-4 py-2 text-sm font-medium">
            Snooze
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-xl bg-[#d92b4d] px-4 py-2 text-sm font-medium text-white">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
