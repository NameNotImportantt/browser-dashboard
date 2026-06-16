import { useEffect, useMemo, useState } from "react";
import { formatClockLabels } from "@/app";
import type { AppSettings } from "@/db/types";

type ClockSettings = Pick<AppSettings, "locale" | "timeFormat" | "dateFormat" | "timezone">;

export function useClock(clockSettings: ClockSettings) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return useMemo(() => {
    const labels = formatClockLabels(now, clockSettings);
    return {
      now,
      ...labels,
    };
  }, [clockSettings, now]);
}
