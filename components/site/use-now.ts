"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onTick: () => void) => {
  const timer = setInterval(onTick, 60_000);
  return () => clearInterval(timer);
};
const minuteNow = () => Math.floor(Date.now() / 60_000);
const serverNow = () => null;

/** Epoch milliseconds, rounded down to the minute and refreshed every minute. null on the server so first paint matches hydration. */
export function useNow(): number | null {
  const minute = useSyncExternalStore(subscribe, minuteNow, serverNow);
  return minute === null ? null : minute * 60_000;
}
