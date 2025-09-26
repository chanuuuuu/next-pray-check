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
