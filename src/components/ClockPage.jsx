import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from "../contexts/TodoContext";

export default function ClockPage() {
  const { state } = useContext(TodoContext);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateString = now.toLocaleDateString();

  // compute next upcoming alarm
  const alarms = Array.isArray(state.alarms)
    ? state.alarms.filter((a) => a.enabled)
    : [];
  const upcoming = alarms
    .map((a) => {
      const [hh, mm] = (a.time || "00:00").split(":");
      const d = new Date(now);
      d.setHours(Number(hh || 0), Number(mm || 0), 0, 0);
      if (d < now) d.setDate(d.getDate() + 1);
      return { alarm: a, when: d };
    })
    .sort((x, y) => x.when - y.when)[0];

  return (
    <main className="flex-1 bg-[#fffdfd] px-4 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.06em] text-[#171827]">
          Clock
        </h2>
        <div className="mt-6 rounded-lg border bg-white p-8 text-center">
          <div className="text-6xl font-mono">{timeString}</div>
          <div className="mt-2 text-sm text-gray-500">{dateString}</div>
        </div>

        {upcoming && (
          <div className="mt-6 rounded-lg border bg-[#faf8ff] p-4">
            <h3 className="font-medium">Next alarm</h3>
            <div className="mt-2 text-sm text-[#6b657a]">
              {upcoming.alarm.label || "Alarm"} •{" "}
              {upcoming.when.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
