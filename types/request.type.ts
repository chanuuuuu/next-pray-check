import { User, UserRow } from "./user.type";

export interface RequestBase {
  request_id: number;
  text: string;
  week_id: number;
  insertId: number;
  user_id: number;
  is_urgent: boolean;
  is_solved: boolean;
}

export type RequestUserFields = Pick<UserRow, "name" | "gisu" | "cell_id">;

export type RequestRow = RequestBase & RequestUserFields;

export interface Request {
  requestId: number;
  text: string;
  weekId: number;
  insertId: number;
  userId: number;
  cellId: number;
  name: string;
  gisu: number;
  isUrgent: boolean;
  isSolved: boolean;
}

export interface ModifyRequest {
  userId: number;
  text: string;
  insertId: number;
  weekId: number;
  isUrgent?: boolean;
}

export interface RequestGroup {
  userId: number;
  name: string;
  gisu: number;
  cellId: number;
  requests: Request[];
}
