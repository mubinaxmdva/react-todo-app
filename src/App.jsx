import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Main from "./components/Main";
import ActiveAlarmOverlay from "./components/ActiveAlarmOverlay";
import { TodoContext } from "./contexts/TodoContext";

function App() {
  const location = useLocation();
  const { state, dispatch } = useContext(TodoContext);
  const previousTimeRef = useRef(state.focusSession?.timeLeft ?? 0);
  const alarmIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const htmlAudioRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    if (!state.focusSession?.isRunning) return undefined;
    const timer = setInterval(
      () => dispatch({ type: "TICK_FOCUS_SESSION" }),
      1000,
    );
    return () => clearInterval(timer);
  }, [state.focusSession?.isRunning, dispatch]);

  useEffect(() => {
    previousTimeRef.current = state.focusSession?.timeLeft ?? 0;
  }, [state.focusSession?.timeLeft]);

  useEffect(() => {
    const scheduler = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (state.focusSession?.isAlarmPlaying) return;

      if (
        state.settings?.alarmClockEnabled &&
        state.settings?.alarmClockTime === hhmm
      ) {
        dispatch({ type: "TRIGGER_ALARM" });
        return;
      }

      const alarms = Array.isArray(state.alarms) ? state.alarms : [];
      alarms.forEach((alarm) => {
        if (!alarm.enabled) return;
        // handle repeat rules
        const alarmTime = alarm.time || "";
        if (alarmTime !== hhmm) return;
        if (alarm.snoozedUntil) {
          const until = new Date(alarm.snoozedUntil);
          if (until > now) return;
        }

        const day = now.getDay(); // 0 Sun - 6 Sat
        if (alarm.repeat === "weekdays") {
          if (day === 0 || day === 6) return;
        } else if (alarm.repeat === "weekends") {
          if (day !== 0 && day !== 6) return;
        } else if (alarm.repeat === "custom") {
          const days = Array.isArray(alarm.days) ? alarm.days : [];
          if (!days.includes(day)) return;
        }

        dispatch({ type: "SET_ACTIVE_ALARM", payload: alarm.id });
        dispatch({ type: "TRIGGER_ALARM", payload: { alarmId: alarm.id } });
      });
    };

    scheduler();
    const id = setInterval(scheduler, 15000);
    return () => clearInterval(id);
  }, [
    state.settings?.alarmClockEnabled,
    state.settings?.alarmClockTime,
    state.alarms,
    state.focusSession?.isAlarmPlaying,
    dispatch,
  ]);

  useEffect(() => {
    if (!state.focusSession?.isAlarmPlaying) {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;

    const audioContext = new AudioCtor();
    audioContextRef.current = audioContext;
    const pattern = [880, 660, 784, 660];
    let step = 0;
    const playTone = (frequency, duration = 0.32) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.0001;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      const startTime = audioContext.currentTime;
      gainNode.gain.exponentialRampToValueAtTime(0.18, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    playTone(pattern[step]);
    alarmIntervalRef.current = setInterval(() => {
      step = (step + 1) % pattern.length;
      playTone(pattern[step]);
    }, 420);

    return () => {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
        alarmIntervalRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [state.focusSession?.isAlarmPlaying]);

  // Play selected alarm sound (HTMLAudio) when alarm triggers and allowed
  useEffect(() => {
    if (!state.focusSession?.isAlarmPlaying) {
      if (htmlAudioRef.current) {
        try {
          htmlAudioRef.current.pause();
        } catch (e) {}
        htmlAudioRef.current = null;
      }
      return;
    }

    const allow = Boolean(state.settings?.allowAlarmSound);
    const activeId = state.focusSession?.activeAlarmId;
    if (!allow || !activeId) return;

    const alarm = (Array.isArray(state.alarms) ? state.alarms : []).find(
      (a) => a.id === activeId,
    );
    const sounds = {
      classic: "/sounds/classic.mp3",
      soft: "/sounds/soft.mp3",
      sharp: "/sounds/sharp.mp3",
    };
    const src =
      alarm && alarm.sound
        ? sounds[alarm.sound]
        : sounds[state.settings?.alarmVoice];
    if (!src) return;

    try {
      const audio = new Audio(src);
      audio.loop = true;
      audio.play().catch(() => {});
      htmlAudioRef.current = audio;
    } catch (e) {
      // ignore play errors
    }

    return () => {
      if (htmlAudioRef.current) {
        try {
          htmlAudioRef.current.pause();
        } catch (e) {}
        htmlAudioRef.current = null;
      }
    };
  }, [
    state.focusSession?.isAlarmPlaying,
    state.focusSession?.activeAlarmId,
    state.settings,
  ]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hideMobileHeader = location.pathname === "/clock";

  useEffect(() => {
    // close mobile menu when navigating to a page that hides header
    if (hideMobileHeader && mobileMenuOpen) setMobileMenuOpen(false);
  }, [hideMobileHeader, mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#f5f3fb] px-4 py-6 md:px-8 xl:px-10">
      <div className="mx-auto flex max-w-[1180px] overflow-hidden rounded-[32px] border border-[#ece4f8] bg-[#fffdfd] shadow-[0_24px_60px_rgba(108,92,160,0.12)]">
        {/* Desktop sidebar — hidden on small screens */}
        <div className="hidden md:block">
          <Header
            onNavigate={() => {
              if (mobileMenuOpen) setMobileMenuOpen(false);
            }}
          />
        </div>

        <Main />

        <ActiveAlarmOverlay />

        {/* Mobile menu button (visible only on small screens) */}
        {!hideMobileHeader && (
          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="md:hidden fixed left-4 top-4 z-60 inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white/95 text-[#4f4b5d] shadow-sm">
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor">
                <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor">
                <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
              </svg>
            )}
          </button>
        )}

        {/* Mobile sidebar overlay/drawer */}
        {!hideMobileHeader && mobileMenuOpen && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div
              className="fixed left-0 top-0 z-60 h-full w-80 max-w-[85%] transform transition-transform duration-300"
              style={{ boxShadow: "0 24px 60px rgba(108,92,160,0.12)" }}>
              <div className="h-full overflow-auto bg-[#fbfbfe]">
                <Header onNavigate={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
