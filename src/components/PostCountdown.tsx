"use client";
import { useEffect, useState } from "react";

interface TimeLeft {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(unlockDate: string): TimeLeft {
  const diff = Math.max(0, new Date(unlockDate).getTime() - Date.now());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function PostCountdown({ lockedUntil }: { lockedUntil: string }) {
  const [time, setTime] = useState<TimeLeft>(() => calcTimeLeft(lockedUntil));

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(lockedUntil)), 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-8">
      <p className="terminal text-xs text-slate-500 tracking-widest uppercase">
        Unlocks on {new Date(lockedUntil).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="flex items-end gap-4 sm:gap-8">
        {[
          { label: "days",    value: time.days    },
          { label: "hours",   value: time.hours   },
          { label: "minutes", value: time.minutes },
          { label: "seconds", value: time.seconds },
        ].map(({ label, value }, i) => (
          <div key={label} className="flex items-end gap-4 sm:gap-8">
            {i > 0 && (
              <span className="terminal text-2xl text-cyan-400/40 mb-2">:</span>
            )}
            <div className="flex flex-col items-center gap-1">
              <span className="font-display font-black text-[clamp(2.5rem,8vw,5rem)] text-white leading-none tabular-nums">
                {label === "days" ? String(value) : pad(value)}
              </span>
              <span className="terminal text-[10px] text-slate-600 tracking-widest uppercase">{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
