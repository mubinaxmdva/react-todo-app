import React, { useEffect, useRef, useState } from "react";

export default function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) return;
    setTimeLeft(total);
    setRunning(true);
  };

  const pause = () => setRunning(false);
  const resume = () => setRunning(true);
  const reset = () => {
    setRunning(false);
    setTimeLeft(0);
  };

  const fmt = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-[20px] border p-4 bg-white">
      <h3 className="text-lg font-semibold">Timer</h3>
      <div className="mt-3 flex gap-2">
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-20"
        />
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="w-20"
        />
        <input
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          className="w-20"
        />
      </div>
      <div className="mt-3 text-2xl font-semibold">{fmt(timeLeft)}</div>
      <div className="mt-3 flex gap-2">
        {!running && timeLeft === 0 && (
          <button
            onClick={start}
            className="px-3 py-2 rounded bg-[#6c55e8] text-white">
            Start
          </button>
        )}
        {running && (
          <button onClick={pause} className="px-3 py-2 rounded bg-[#f1ecff]">
            Pause
          </button>
        )}
        {!running && timeLeft > 0 && (
          <button
            onClick={resume}
            className="px-3 py-2 rounded bg-[#6c55e8] text-white">
            Resume
          </button>
        )}
        <button onClick={reset} className="px-3 py-2 rounded bg-[#f6f0ff]">
          Reset
        </button>
      </div>
    </div>
  );
}
