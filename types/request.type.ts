import { UserRow } from "./user.type";

export interface RequestBase {
  request_id: number;
  text: string;
  week_id: number;
  user_id: number;
}

export type RequestUserFields = Pick<
  UserRow,
  "group_id" | "name" | "gisu" | "cell_id"
>;

export type RequestRow = RequestBase & RequestUserFields;

export interface Request {
  requestId: number;
  text: string;
  weekId: number;
  userId: number;
  groupId: number;
  cellId: number;
  name: string;
  gisu: number;
}
