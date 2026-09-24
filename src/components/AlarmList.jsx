import React, { useContext, useMemo, useState } from "react";
import AlarmCard from "./AlarmCard";
import AlarmModal from "./AlarmModal";
import { TodoContext } from "../contexts/TodoContext";

export default function AlarmList() {
  const { state, dispatch } = useContext(TodoContext);
  const alarms = Array.isArray(state.alarms) ? state.alarms : [];
  const [editing, setEditing] = useState(null);

  const sorted = useMemo(() => {
    return [...alarms].sort((a, b) =>
      (a.time || "").localeCompare(b.time || ""),
    );
  }, [alarms]);

  const handleAdd = () => setEditing({});
  const handleEdit = (alarm) => setEditing(alarm);
  const handleDelete = (id) => dispatch({ type: "DELETE_ALARM", payload: id });
  const handleToggle = (id) => dispatch({ type: "TOGGLE_ALARM", payload: id });
  const getNextAlarmId = () => `alarm-${Date.now()}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Alarms</h3>
        <button
          onClick={handleAdd}
          className="rounded-xl bg-[#6c55e8] px-3 py-2 text-white">
          Add
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          No alarms yet
        </div>
      ) : (
        sorted.map((a) => (
          <AlarmCard
            key={a.id}
            alarm={a}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))
      )}

      {editing && (
        <AlarmModal
          alarm={editing}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            if (!next.id) next.id = getNextAlarmId();
            if (editing && editing.id)
              dispatch({ type: "EDIT_ALARM", payload: next });
            else dispatch({ type: "ADD_ALARM", payload: next });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
