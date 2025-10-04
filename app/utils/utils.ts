"use server";

import { LEVEL_OPTIONS } from "./constants";

export async function getGisu(birth: string) {
  if (!birth) return 0;
  const BASE = {
    fullYear: "1994",
    gisu: 35,
  };
  const year = birth.slice(0, 2);
  const fullYear = (parseInt(year) > 80 ? "19" : "20") + year;
  const gap = parseInt(fullYear) - parseInt(BASE.fullYear);
  const targetGisu = BASE.gisu + (gap || 0);
  return targetGisu;
}

export async function getLevel(
  level: string,
  type: "label" | "value" = "label"
) {
  return (
    Object.values(LEVEL_OPTIONS).find((option) => option[type] === level)
      ?.value || LEVEL_OPTIONS.TEAM_MEMBER.value
  );
}

export function getWeekDay(day?: string) {
  const now = day ? new Date(day) : new Date();
  const weekDay = getWeekCount(now);
  const year = now.getFullYear().toString().slice(2);
  const formattedWeekDay = (weekDay < 10 ? "0" : "") + weekDay;

  return parseInt(year + formattedWeekDay);
}

export function getWeekCount(now: Date) {
  const start = new Date(now.getFullYear(), 0, 1);

  let diffDate = now.getTime() - start.getTime();
  diffDate = diffDate / (1000 * 60 * 60 * 24);

  let weekDay = Math.floor(diffDate / 7) + 1;
  if (now.getDay() < start.getDay()) weekDay += 1;

  return weekDay;
}
