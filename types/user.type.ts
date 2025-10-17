// 데이터베이스 컬럼명에 맞는 타입 추가
export interface UserRow {
  user_id: number;
  group_id: number;
  cell_id: number;
  name: string;
  birth: string;
  gisu: number;
  level: number;
  created_at: string;
}

// 실제 사용되는 타입
export interface User {
  userId: number; // 사용자 ID
  groupId: number; // 소속 그룹
  cellId: number; // 소속 셀
  name: string; // 이름
  birth: string; // 생년월일
  gisu: number; // 기수
  level: number; // 권한
}

// 인원 등록시에 조편성을 위한 리더 타입
export type Leader = CellMember;

export interface CellMember {
  groupId: number; // 소속 그룹
  cellId: number; // 소속 셀
  name: string; // 이름
  level: number; // 권한
}

// Generic Cell 타입
export interface Cell<T extends CellMember> {
  cellId: number;
  leaderName: string;
  users: T[];
}

export interface UserLoginInput {
  name: string; // 이름
  birth: string; // 생년월일
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
