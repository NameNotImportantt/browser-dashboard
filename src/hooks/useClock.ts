import { useEffect, useMemo, useState } from "react";

export function useClock(locale = "ru-RU") {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return useMemo(
    () => ({
      now,
      timeLabel: new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now),
      dateLabel: new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "2-digit",
        month: "long",
      }).format(now),
    }),
    [locale, now],
  );
}
