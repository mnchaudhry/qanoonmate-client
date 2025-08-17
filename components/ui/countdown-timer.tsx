import React, { useEffect, useMemo, useState } from "react";
import { useAnimate, motion } from "framer-motion";
import clsx from "clsx";

const COUNTDOWN_FROM = "2025-08-22T00:00:00";
const END_TIME_MS = new Date(COUNTDOWN_FROM).getTime();

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

type Unit = "Day" | "Hour" | "Minute" | "Second";

export default function ShiftingCountdown() {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-wrap justify-center gap-6 mt-8">

      <CountdownItem unit="Day" label="Days" now={now} />
      <CountdownItem unit="Hour" label="Hours" now={now} />
      <CountdownItem unit="Minute" label="Minutes" now={now} />
      <CountdownItem unit="Second" label="Seconds" now={now} />
    </div>
  );
}

function CountdownItem({ unit, label, now }: { unit: Unit; label: string; now: number }) {
  const { ref, time } = useTimer(unit, now);
  const display = unit === "Second" ? String(time).padStart(2, "0") : time;

  return (
    <div className="flex flex-col items-center w-28 perspective-1000">
      <motion.div
        className={clsx(
          "relative w-full rounded-2xl border border-white/20 px-2 py-4 shadow-xl overflow-hidden backdrop-blur-lg",
          "bg-white/10"
        )}
        whileHover={{ rotateX: 5, rotateY: -5, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 150, damping: 12 }}
      >
        <motion.span
          ref={ref}
          className="block text-5xl font-extrabold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark drop-shadow-md"
          animate={{ scale: [1, 1.1, 1], transition: { duration: 0.4 } }}
        >
          {display}
        </motion.span>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white/10 via-transparent to-transparent animate-pulse" />
      </motion.div>
      <span className="mt-2 text-sm text-muted-foreground tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}

function useTimer(unit: Unit, now: number) {
  const [ref, animate] = useAnimate();
  const [time, setTime] = useState<number>(0);
  const distance = useMemo(() => Math.max(0, END_TIME_MS - now), [now]);

  useEffect(() => {
    let newTime = 0;
    switch (unit) {
      case "Day":
        newTime = Math.max(0, Math.floor(distance / DAY));
        break;
      case "Hour":
        newTime = Math.max(0, Math.floor((distance % DAY) / HOUR));
        break;
      case "Minute":
        newTime = Math.max(0, Math.floor((distance % HOUR) / MINUTE));
        break;
      case "Second":
      default:
        newTime = Math.max(0, Math.floor((distance % MINUTE) / SECOND));
        break;
    }

    if (newTime !== time) {
      (async () => {
        await animate(
          ref.current,
          { y: ["0%", "-40%"], opacity: [1, 0] },
          { duration: 0.25 }
        );
        setTime(newTime);
        await animate(
          ref.current,
          { y: ["40%", "0%"], opacity: [0, 1] },
          { duration: 0.25 }
        );
      })();
    }
  }, [distance, unit, time, animate, ref]);

  return { ref, time } as const;
}
