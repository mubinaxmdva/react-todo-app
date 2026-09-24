import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function AlarmCard({ alarm, onEdit, onDelete, onToggle }) {
  if (!alarm) return null;

  const timeLabel = alarm.time || "--:--";
  const repeatLabel =
    alarm.repeat === "once" ? "Once" : alarm.repeat || "Custom";

  return (
    <div className="flex items-center justify-between rounded-[16px] border p-4 bg-white">
      <div>
        <div className="flex items-baseline gap-3">
          <div className="text-2xl font-semibold">{timeLabel}</div>
          <div className="text-sm text-[#6b657a]">{alarm.label || "Alarm"}</div>
        </div>
        <div className="mt-2 text-sm text-[#7d7789]">
          {repeatLabel} • {alarm.sound || "classic"}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(alarm.enabled)}
            onChange={() => onToggle(alarm.id)}
            aria-label={alarm.enabled ? "Disable alarm" : "Enable alarm"}
          />
        </label>
        <button
          onClick={() => onEdit(alarm)}
          className="p-2 rounded-md bg-[#f3f2ff]"
          aria-label="Edit alarm">
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(alarm.id)}
          className="p-2 rounded-md bg-[#fff0f0]"
          aria-label="Delete alarm">
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
