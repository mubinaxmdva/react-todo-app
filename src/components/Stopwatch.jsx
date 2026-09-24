import React, { useEffect, useRef, useState } from "react";

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed * 1000;
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 200);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };
  const lap = () => setLaps((s) => [elapsed, ...s]);

  const fmt = (t) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = t % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-[20px] border p-4 bg-white">
      <h3 className="text-lg font-semibold">Stopwatch</h3>
      <div className="mt-3 text-2xl font-semibold">{fmt(elapsed)}</div>
      <div className="mt-3 flex gap-2">
        {!running && (
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
        <button onClick={reset} className="px-3 py-2 rounded bg-[#f6f0ff]">
          Reset
        </button>
        {running && (
          <button onClick={lap} className="px-3 py-2 rounded bg-[#f7f2ff]">
            Lap
          </button>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {laps.map((l, idx) => (
          <div key={idx} className="text-sm text-[#6c697d]">
            Lap {laps.length - idx}: {fmt(l)}
          </div>
        ))}
      </div>
    </div>
  );
}
