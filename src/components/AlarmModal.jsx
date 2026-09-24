import React, { useEffect, useRef, useState } from "react";

const defaultSounds = [
  { id: "classic", name: "Classic chime", src: "/sounds/classic.mp3" },
  { id: "soft", name: "Soft melody", src: "/sounds/soft.mp3" },
  { id: "sharp", name: "Sharp alert", src: "/sounds/sharp.mp3" },
];

export default function AlarmModal({ alarm = {}, onClose, onSave }) {
  const [time, setTime] = useState(alarm.time || "07:00");
  const [label, setLabel] = useState(alarm.label || "");
  const [repeat, setRepeat] = useState(alarm.repeat || "once");
  const [sound, setSound] = useState(alarm.sound || "classic");
  const [enabled, setEnabled] = useState(Boolean(alarm.enabled ?? true));
  const [snooze, setSnooze] = useState(alarm.snooze || 5);
  const audioRef = useRef(null);
  const playingRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePreview = (soundId) => {
    // stop previous
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const src = defaultSounds.find((s) => s.id === soundId)?.src;
    if (!src) return; // no local source

    try {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.play().catch(() => {
        // playback may be blocked until user interacts
      });
    } catch (e) {
      // ignore
    }
    playingRef.current = soundId;
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      playingRef.current = null;
    }, 3000);
  };

  const handleSave = () => {
    const next = {
      id: alarm.id || Date.now(),
      time,
      label,
      repeat,
      sound,
      enabled,
      snooze,
    };
    onSave?.(next);
  };

  useEffect(() => {
    // if editing existing alarm, ensure repeat days array exists for custom
    if (alarm?.repeat === "custom" && Array.isArray(alarm.days)) {
      // no-op; could set local days state if we add UI
    }
  }, [alarm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {alarm.id ? "Edit Alarm" : "Add Alarm"}
          </h3>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="mt-3 space-y-3">
          <label className="block">
            Time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </label>

          <label className="block">
            Label
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full"
            />
          </label>

          <label className="block">
            Repeat
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              className="w-full">
              <option value="once">Once</option>
              <option value="everyday">Every day</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label className="block">
            Sound
            <div className="mt-2 space-y-2">
              {defaultSounds.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>{s.name}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(s.id)}
                      className="px-2 py-1 rounded bg-[#f1ecff]">
                      Preview
                    </button>
                    <button
                      onClick={() => setSound(s.id)}
                      className={`px-2 py-1 rounded ${sound === s.id ? "bg-[#6c55e8] text-white" : "bg-[#f7f5ff]"}`}>
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </label>

          <label className="block">
            Snooze (minutes)
            <select
              value={snooze}
              onChange={(e) => setSnooze(Number(e.target.value))}
              className="w-full">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />{" "}
            Enabled
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-[#6c55e8] text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
