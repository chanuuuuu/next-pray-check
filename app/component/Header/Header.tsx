import { getUserBySession, deleteSession } from "@/server/session";
import { Navigator } from "./Navigator";

export async function Header() {
  const user = await getUserBySession();

  async function handleLogout() {
    "use server";
    await deleteSession();
  }
  return <header>{user && <Navigator handleLogout={handleLogout} />}</header>;
}
