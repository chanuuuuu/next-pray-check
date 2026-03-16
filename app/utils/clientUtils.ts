import { User, Leader, Cell, CellMember } from "@/types/user.type";

export function getBirthDisplay(birth: string): string {
  if (!birth || birth.length < 6) return "";
  return birth.slice(2);
}

export function getLeaders(users: User[]): Leader[] {
  let max = 1;
  const filteredLeaders = users.reduce((acc, user) => {
    const { name, level, cellId } = user;
    if (cellId >= max) max = cellId + 1;
    const findLeader = acc.findIndex((l) => l.cellId === user.cellId);
    if (findLeader > -1) {
      acc[findLeader] = {
        ...acc[findLeader],
        name: acc[findLeader].name + (level > 1 ? `, ${name}` : ""),
      };
    } else {
      acc.push({
        ...user,
        name: cellId + "조 " + (level > 1 ? `- ${name}` : ""),
      });
    }
    return acc;
  }, [] as Leader[]);

  filteredLeaders.push({
    groupId: users[0]?.groupId ?? 1,
    cellId: max,
    name: "신규 등록",
    level: 2,
  } as Leader);
  return filteredLeaders;
}

export function getCells<T extends CellMember>(users: T[]): Cell<T>[] {
  return users.reduce((_cells: Cell<T>[], user: T) => {
    const existingCellIndex = _cells.findIndex(
      (cell) => cell.cellId === user.cellId
    );

    const { name, level } = user;
    if (existingCellIndex >= 0) {
      if (level === 2) {
        const { leaderName } = _cells[existingCellIndex];
        _cells[existingCellIndex].leaderName = leaderName
          ? `${leaderName},${name}`
          : name;
      }
      _cells[existingCellIndex].users.push(user);
    } else {
      const leaderName = level === 2 ? name : "";
      _cells.push({
        cellId: user.cellId,
        leaderName,
        users: [user],
      });
    }

    return _cells;
  }, [] as Cell<T>[]);
}

export function removeAtIndex<T>(array: T[], index: number): T[] {
  return array.filter((_, i) => i !== index);
}

// weekId = YYWW (예: 2610 → 26년 10주차)
export function getAttendanceWeekLabel(weekId: number): string {
  const weekStr = weekId.toString();
  const yearStr = weekStr.slice(0, 2);
  const week = parseInt(weekStr.slice(2));
  const year = 2000 + parseInt(yearStr);

  const jan1 = new Date(year, 0, 1);
  const startDate = new Date(jan1.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);

  const month = startDate.getMonth() + 1;
  const day = startDate.getDate();

  return `${yearStr}년 ${month}월 ${day}일 ${week}주차`;
}
