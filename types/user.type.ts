// 실제 사용되는 타입
export interface User {
  cellId: number;
  memberId: number;
  name: string;
  birth: string;
  gisu: number;
  level: number;
}

// DB DTO
export interface UserDto extends User {
  groupId: number; // 소속
}

export interface PrayerRequest extends User {
  insertId: number;
  request: string;
}

export interface PrayerRequestGroup extends User {
  insertId: number;
  requests: string[];
}
