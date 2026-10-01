import { useEffect, useState } from "react";
import { site } from "../data/content";

const format = new Intl.DateTimeFormat("en-US", {
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export default function LocalTime({ className = "" }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(id);
  }, []);

  const parts = Object.fromEntries(format.formatToParts(now).map((p) => [p.type, p.value]));

  return (
    <time dateTime={now.toISOString()} className={`tabular ${className}`}>
      {parts.hour}
      <span className="blink">:</span>
      {parts.minute} {parts.dayPeriod} IST
    </time>
  );
}
