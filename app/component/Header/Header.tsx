import { getUserBySession } from "@/server/session";
import { Navigator } from "./Navigator";

export async function Header() {
  const user = await getUserBySession();

  return <header>{user && <Navigator user={user} />}</header>;
}
