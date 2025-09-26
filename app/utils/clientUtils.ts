export function getBirthDisplay(birth: string): string {
  if (!birth || birth.length < 6) return "";
  return birth.slice(2);
}
